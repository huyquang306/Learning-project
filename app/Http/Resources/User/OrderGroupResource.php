<?php

namespace App\Http\Resources\User;

use App\Models\TOrder;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $orders = $this->tOrders()
            ->with([
                'rShopMenu.mMenu',
                'rShopCourse.mCourse.childCourses.rShopCourse.mCoursePrices',
            ])
            ->get();
        $mCourse = $this->getCourse($orders);

        // get course extend info
        $courseExtendPrice = null;
        $courseExtend = $mCourse && $mCourse->childCourses ? $mCourse->childCourses->first() : null;
        if ($courseExtend && $courseExtend->rShopCourse  && $courseExtend->rShopCourse->mCoursePrices) {
            $courseExtendPrice = $courseExtend->rShopCourse->mCoursePrices->first();
        }
        $orders = BillingOrderResource::collection($orders);

        return [
            'hash_id' => $this->hash_id,
            'status' => $this->status,
            'start_time' => $this->start_time,
            'order_blocked' => $this->order_blocked,
            'count' => $this->count,
            'total_billing' => $this->total_billing,
            'number_of_customers' => $this->number_of_customers,
            'published_at' => $this->published_at,
            'invoice_code' => makeInvoiceCode($this->created_at, $this->id),
            'course_hash_id' => $mCourse ? $mCourse->hash_id : null,
            'm_course' => $mCourse,
            'extend_course_time' => $courseExtend ? $courseExtend->time_block_unit : null,
            'extend_course_price' => $courseExtendPrice ? $courseExtendPrice->unit_price : null,
            'orders' => $orders,
            'file_path' => $this->file_path,
            'table_code' => !$this->mTables->isEmpty() ? $this->mTables[0]->code : null,
        ];
    }

    public function getCourse($tOrders = [])
    {
        $courseOrder = $tOrders->filter(function ($order) {
            return $order->order_type === TOrder::COURSE_ORDER_TYPE_VALUE && $order->status != config('const.STATUS_CANCEL');
        })->first();

        return $courseOrder ? $courseOrder->rShopCourse->mCourse : null;
    }
}
