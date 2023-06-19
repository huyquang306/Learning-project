<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\OrderRequest;
use App\Http\Requests\Shop\OrderUpdateRequest;
use App\Http\Resources\Shop\OrderGroupResource;
use App\Http\Resources\Shop\OrderResource;
use App\Models\MShop;
use App\Models\TOrder;
use App\Models\TOrderGroup;
use App\Services\Shop\OrderService;
use App\Services\PrinterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends BaseApiController
{
    protected $orderService;
    protected $printerService;

    public function __construct(
        OrderService $orderService,
        PrinterService $printerService
    ) {
        $this->orderService = $orderService;
        $this->printerService = $printerService;
    }

    /**
     * @param OrderRequest $request
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return array|\Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function create(OrderRequest $request, MShop $shop, TOrderGroup $ordergroup)
    {
        try {
            DB::beginTransaction();
            // if ordergroup can be is REQUEST_CHECKOUT, WAITING_CHECKOUT.... can't order
            if (!in_array($ordergroup->status, [
                config('const.STATUS_ORDERGROUP.PRE_ORDER'),
                config('const.STATUS_ORDERGROUP.ORDERING'),
            ])) {
                return response()->json([
                    'status'  => 'failure',
                    'message'  => "ordergroup not accept new order",
                    'order_status' => $ordergroup->status
                ], 400);
            }

            $orders = $this->orderService->createOrder($request, $shop, $ordergroup);
            $outputFile = $this->printerService->createCreateOrderTemplate(
                $shop,
                $ordergroup,
                $orders,
                TOrder::ADD_ORDER_TYPE
            );
            $position = config('const.PRINTER_POSITIONS.KITCHEN.value');
            // Insert to Job Queue
            // $this->printerService->insertJobQueue($shop->id, $outputFile, $position);
            DB::commit();

            return OrderResource::collection($orders)->additional([
                'status' => 'success',
                'message' => ''
            ]);

        } catch (\PDOException $e) {
            \Log::info($e);
            DB::rollBack();

            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields'=>'', 'errorCode'=>'pdo_exception', 'errorMessage' => '']
            ];
        } catch (\Exception $e) {
            DB::rollBack();

            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields'=>'', 'errorCode'=>'exception', 'errorMessage' => $e->getMessage()]
            ];
        }
    }

    /**
     * Create|Update|Cancel menu orders
     *
     * @param OrderUpdateRequest $request
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return OrderGroupResource
     */
    public function menuUpdate(OrderUpdateRequest $request, MShop $shop, TOrdergroup $ordergroup): OrderGroupResource
    {
        $ordergroup = $this->orderService->updateMenu($request, $shop, $ordergroup);

        return new OrderGroupResource($ordergroup);
    }

}
