<?php

namespace App\Services\Utils;

use App\Models\TOrderGroup;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderServiceUtil
{
    protected $orderGroupRepository;
    protected $orderRepository;

    public function __construct(
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository
    ) {
        $this->orderGroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
    }

    /**
     * Recalculate extends course, if wrong then update
     *
     * @param TOrderGroup $orderGroup
     * @return TOrderGroup
     */
    public function recalculateCourseOrdersAndUpdate(TOrderGroup $orderGroup)
    {
        $orderGroup = $this->orderGroupRepository->getOrderGroupCalculateData($orderGroup);

        // Check orderGroup status is not CHECKED_OUT|CANCEL
        if ($orderGroup->status === config('const.STATUS_ORDERGROUP.CHECKED_OUT')
            || $orderGroup->status === config('const.STATUS_ORDERGROUP.CANCEL')
        ) {
            return $orderGroup;
        }

        // Check orderGroup has course
        $orders = $orderGroup->tOrders;
        $mCourse = null;
        $mExtendCourse = null;
        $mExtendCoursePrice = null;
        $courseStartTime = null;
        $orderExtendParams = [
            'user_hash_id' => null,
            'course_hash_id' => '',
            'course_price_hash_id' => '',
            'quantity' => '',
        ];
        foreach ($orders as $order) {
            // Check orderGroup has a course
            $isCourseOrder = $order->r_shop_course_id
                && $order->order_type == config('const.ORDER_TYPE.ORDER_COURSE')
                && $order->status != config('const.STATUS_CANCEL');
            if ($isCourseOrder) {
                $mCourse = $order->rShopCourse->mCourse;
                $mExtendCourse = $mCourse->childCourses->first();
                $courseStartTime = Carbon::parse($order->ordered_at)
                    ->startOfMinute();
            }
            if ($mExtendCourse) {
                $mExtendCoursePrice = $mExtendCourse->rShopCourse
                    ->mCoursePrices
                    ->first();
            }
            if ($mExtendCoursePrice) {
                $orderExtendParams = [
                    'course_hash_id' => $mExtendCourse->hash_id,
                    'course_price_hash_id' => $mExtendCoursePrice->hash_id,
                    'quantity' => $order->quantity,
                ];
                break;
            }
        }
        // Case: does not have a course
        if (!$mCourse || !$mExtendCourse || !$mExtendCoursePrice) {
            return $orderGroup;
        }

        // Get extend orders
        $extendOrders = $orders->filter(function ($order) use ($mExtendCourse) {
            return $order->r_shop_course_id
                && $order->order_type == config('const.ORDER_TYPE.ORDER_EXTEND_COURSE')
                && $order->r_shop_course_id === $mExtendCourse->id;
        });
        $extendOrders = collect($extendOrders->values());
        $extendsNumber = $extendOrders->count();

        $courseTime = $mCourse->time_block_unit;
        $extendCourseTime = $mExtendCourse ? $mExtendCourse->time_block_unit : 0;
        $requestCheckoutTime = $orderGroup->payment_request_time
            ? Carbon::parse($orderGroup->payment_request_time)
            : Carbon::now()->startOfSecond();

        // Check total extend time over eat time
        $eatTime = $requestCheckoutTime->diffInMinutes($courseStartTime);
        $totalCourseTime = $courseTime + $extendCourseTime * $extendsNumber;

        DB::beginTransaction();
        try {
            // Case: lack of extend course
            if ($eatTime >= $totalCourseTime) {
                $this->createLackOfExtendCourse(
                    $orderGroup,
                    $courseStartTime,
                    $courseTime,
                    $extendsNumber,
                    $extendCourseTime,
                    $orderExtendParams,
                    $requestCheckoutTime
                );
            } else if ($eatTime < $totalCourseTime - $extendCourseTime) {
                // Case: extend course over eat time
                // Check|Remove duplicate extend course
                $this->removeDuplicateExtendCourse($extendOrders);

                // Re-check lack of extend orders
                $orders = $orderGroup->load('tOrders')->tOrders;
                $extendOrders = $orders->filter(function ($order) use ($mExtendCourse) {
                    return $order->r_shop_course_id
                        && $order->order_type == config('const.ORDER_TYPE.ORDER_EXTEND_COURSE')
                        && $order->r_shop_course_id === $mExtendCourse->id;
                });
                $extendOrders = collect($extendOrders->values());
                $extendsNumber = $extendOrders->count();

                // Check total extend time over eat time
                $eatTime = $requestCheckoutTime->diffInMinutes($courseStartTime);
                $totalCourseTime = $courseTime + $extendCourseTime * $extendsNumber;
                if ($eatTime >= $totalCourseTime) {
                    $this->createLackOfExtendCourse(
                        $orderGroup,
                        $courseStartTime,
                        $courseTime,
                        $extendsNumber,
                        $extendCourseTime,
                        $orderExtendParams,
                        $requestCheckoutTime
                    );
                }
            }
            $this->updateTotalBilling($orderGroup);

            DB::commit();
        } catch (Exception $exception) {
            DB::rollBack();
            Log::error($exception);
        }

        return $orderGroup;
    }

    /**
     * Create missing extend courses
     *
     * @param TOrderGroup $orderGroup,
     * @param Carbon      $courseStartTime,
     * @param int         $courseTime,
     * @param int         $extendsNumber,
     * @param int         $extendCourseTime,
     * @param array       $orderExtendParams,
     * @param Carbon      $requestCheckoutTime
     * @return void
     */
    public function createLackOfExtendCourse(
        TOrderGroup $orderGroup,
        Carbon $courseStartTime,
        int $courseTime,
        int $extendsNumber,
        int $extendCourseTime,
        array $orderExtendParams,
        Carbon $requestCheckoutTime
    ) {
        $courseEndTime = $courseStartTime
            ->addMinutes($courseTime)
            ->addMinutes($extendsNumber * $extendCourseTime);
        while ($courseEndTime <= $requestCheckoutTime) {
            // create missing order
            $orderExtendParams['ordered_at'] = $courseEndTime;
            $this->orderRepository->createOrder(
                [$orderExtendParams],
                $orderGroup->mShop,
                $orderGroup
            );
            $courseEndTime->addMinutes($extendCourseTime);
        }
    }

    /**
     * Remove duplicate extend course
     *
     * @param Collection $extendOrders
     * @return void
     */
    protected function removeDuplicateExtendCourse(Collection $extendOrders)
    {
        foreach ($extendOrders as $orderIndex => $order) {
            if ($orderIndex === 0) {
                continue;
            }

            // Check 2 orders ordered_at less than a minute
            $beforeOrderedAt = Carbon::parse($extendOrders[$orderIndex - 1]->ordered_at);
            $orderOrderedAt = Carbon::parse($order->ordered_at);
            if ($orderOrderedAt->diffInMinutes($beforeOrderedAt) <= 1) {
                $order->delete();
            }
        }
    }

    /**
     * update total billing
     *
     * @param TOrderGroup $ordergroup
     * @return void
     */
    public function updateTotalBilling(TOrderGroup $ordergroup)
    {
        $ordergroup->load('tOrders');
        $totalBilling = 0;
        if (count($ordergroup->tOrders)) {
            $orders = $ordergroup->tOrders;

            foreach ($orders as $order) {
                if ($order->status != config('const.STATUS_CANCEL')) {
                    $totalBilling += $order->amount;
                }
            }
        }
        if ($ordergroup->total_billing != 0 && $ordergroup->total_billing != $totalBilling) {
            $ordergroup->total_billing = $totalBilling;
            $ordergroup->save();
        }
    }
}
