<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\OrderGroupRequest;
use App\Http\Resources\Shop\DeleteOrderGroupResource;
use App\Http\Resources\Shop\HistorySummaryOrderGroupResource;
use App\Http\Resources\Shop\OrderGroupResource;
use App\Http\Resources\Shop\SummaryOrderGroupResource;
use App\Models\MShop;
use App\Models\TOrder;
use App\Models\TOrderGroup;
use App\Services\PrinterService;
use App\Services\Shop\OrderGroupService;
use App\Services\User\CourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderGroupController extends BaseApiController
{
    protected $orderGroupService;
    protected $printerService;
    protected $courseService;

    public function __construct(
        OrderGroupService $orderGroupService,
        PrinterService $printerService,
        CourseService $courseService
    ){
        $this->orderGroupService = $orderGroupService;
        $this->printerService = $printerService;
        $this->courseService = $courseService;
    }

    /**
     * Get orderGroups summary
     *
     * @param Request $request
     * @param MShop $shop
     * @return JsonResponse
     */
    public function getSummary(Request $request, MShop $shop): JsonResponse
    {
        $orderGroups = $this->orderGroupService->getSummary($request, $shop);
        $orderGroups = $this->orderGroupService->getTablesOfOrderGroups($orderGroups);

        return response()->json([
            'status'  => 'success',
            'message' => 'message',
            'data'    => SummaryOrderGroupResource::collection($orderGroups),
        ]);
    }

    /**
     * Get Ordergroups
     *
     * @param Request $request
     * @param MShop $shop
     * @return OrderGroupResource|mixed
     */
    public function getOrdergroups(Request $request, MShop $shop)
    {
        $orderGroups = $this->orderGroupService->getOrdergroups($request, $shop);
        $orderGroups = $this->orderGroupService->getTablesOfOrderGroups($orderGroups);

        return response([
            'status'  => 'success',
            'message' => '',
            'data'    => new HistorySummaryOrderGroupResource($orderGroups),
        ]);
    }

    /**
     * Create ordergroup
     *
     * @param OrderGroupRequest $request
     * @param MShop $shop
     * @return OrderGroupResource|mixed
     */
    public function create(OrderGroupRequest $request, MShop $shop)
    {
        try {
            DB::beginTransaction();
            // check table is available
            $checkTableAvailable = $this->orderGroupService->checkTableAvailable($request->add_hash_id);
            if (!$checkTableAvailable) {
                return response()->json([
                    'status'  => 'failure',
                    'message' => 'Bàn đã được đặt',
                    'result' => []
                ], 406);
            }

            $orderGroup = $this->orderGroupService->createOrderGroup($request, $shop);
            // Create print file
            $add_hash_id = $request->add_hash_id;
            $outputFile = $this->printerService->createBarCodeTemplate($shop, $orderGroup, $add_hash_id);

            // Insert to Job Queue
            //$position = config('const.PRINTER_POSITIONS.FRONT.value');
            //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);

            // Print Order Course by Shop
            if ($request->course_hash_id && $request->course_price_hash_id) {
                $course = $this->courseService->getCourseByHashId($request->course_hash_id);
                $positionPrintCourse = config('const.PRINTER_POSITIONS.KITCHEN.value');
                $outputFileOrderCourse = $this->printerService->createOrderByCourseTemplate($shop, $orderGroup, $course);
                //$this->printerService->insertJobQueue($shop->id, $outputFileOrderCourse, $positionPrintCourse);
            }
            // Order initial menus
            $orders = $this->orderGroupService->orderInitialMenus($shop, $orderGroup, $request);
            if ($orders && count($orders)) {
                $outputFile = $this->printerService->createCreateOrderTemplate(
                    $shop,
                    $orderGroup,
                    $orders,
                    TOrder::ADD_ORDER_TYPE
                );
                // Insert to Job Queue
                //$position = config('const.PRINTER_POSITIONS.KITCHEN.value');
                //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);
            }
            $orderGroup->base_customer_url = '/shop-order/' . $shop->hash_id . '?ordergroup_hash_id=' . $orderGroup->hash_id . '&shop_name=' . urlencode($shop->name);
            DB::commit();

            return new OrderGroupResource($orderGroup);
        } catch (\PDOException $e) {
            Log::info($e);
            DB::rollBack();

            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields' => '', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()]
            ];
        }
    }

    /**
     * Delete order group
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return OrderGroupResource|mixed
     */
    public function delete(MShop $shop, TOrderGroup $ordergroup)
    {
        try {
            $order_group = $this->orderGroupService->deleteOrderGroup($shop, $ordergroup);
            return new DeleteOrderGroupResource($order_group);
        } catch (\PDOException $e) {
            DB::rollBack();
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields' => '', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()]
            ];
        }
    }

    /**
     * Update ordergroup
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @param OrderGroupRequest $request
     * @return mixed
     */
    public function update(OrderGroupRequest $request, MShop $shop, TOrdergroup $ordergroup)
    {
        try {
            $checkTableAvailable = $this->orderGroupService->checkTableAvailable($request->add_hash_id, $ordergroup->id);
            if (!$checkTableAvailable) {
                return response()->json([
                    'status'  => 'failure',
                    'message' => 'tables not available',
                    'result' => []
                ], 406);
            }

            $ordergroup = $this->orderGroupService->getOrderGroupWithOrdersData($ordergroup, [
                config('const.STATUS_ORDER'),
                config('const.STATUS_FINISH'),
            ]);
            if ($ordergroup->mCourse
                && $ordergroup->mCourse->hash_id !== $request->course_hash_id
                && count($ordergroup->tOrders)
            ) {
                return response()->json([
                    'status'  => 'failure',
                    'message' => 'Không thể thay đổi set ăn',
                    'result' => [],
                ], 406);
            }
            $orderGroup = $this->orderGroupService->updateOrderGroup($request, $shop, $ordergroup);

            // Print Order Course by Shop
            if ($request->course_hash_id && $request->course_price_hash_id) {
                $course = $this->courseService->getCourseByHashId($request->course_hash_id);
                $positionPrintCourse = config('const.PRINTER_POSITIONS.KITCHEN.value');
                $outputFileOrderCourse = $this->printerService->createOrderByCourseTemplate($shop, $orderGroup, $course);
                //$this->printerService->insertJobQueue($shop->id, $outputFileOrderCourse, $positionPrintCourse);
            }

            return new OrderGroupResource($orderGroup);
        } catch (\PDOException $e) {
            DB::rollBack();

            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields' => '', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()]
            ];
        }
    }

    /**
     * Extend course for ordergroup
     * @param Request $request
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function extendTime(Request $request, MShop $shop, TOrdergroup $ordergroup)
    {
        try {
            if ($request->course_hash_id && $request->course_price_hash_id) {
                $tOrderData = [
                    'course_hash_id' => $request->course_hash_id,
                    'course_price_hash_id' => $request->course_price_hash_id,
                    'quantity' => $request->number_of_customers,
                ];
            }
            $orderGroup = $this->orderGroupService->extendCourse($tOrderData, $shop, $ordergroup);

            // Extend successful
            if ($orderGroup) {
                return new OrderGroupResource($orderGroup);
            }

            return $this->responseApi([
                'isExtend' => false,
            ]);
        } catch (\Exception $exception) {
            return $this->responseApi([
                'errorMessage' => $exception->getMessage(),
                'orderGroup' => $ordergroup,
            ], 400, $exception->getMessage());
        }
    }
}
