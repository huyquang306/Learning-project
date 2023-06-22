<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\OrderRequest;
use App\Http\Resources\User\OrderResource;
use App\Models\MMenu;
use App\Models\MShop;
use App\Models\TOrder;
use App\Models\TOrderGroup;
use App\Services\User\OrderService;
use App\Services\User\PrinterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    protected $orderService;
    protected $printerService;

    public function __construct(OrderService $orderService, PrinterService $printerService)
    {
        $this->orderService = $orderService;
        $this->printerService = $printerService;
    }

    /**
     * @param OrderRequest $request
     * @param MShop $shop
     * @param TOrderGroup $odergroup
     *
     * @return mixed
     */
    public function create(OrderRequest $request, MShop $shop, TOrderGroup $odergroup)
    {
        try {
            $orders = $this->orderService->createOrder($request, $shop, $odergroup);

            // Create print file data
            /*
            $outputFile = $this->printerService->createCreateOrderTemplate(
                $shop,
                $odergroup,
                $orders
            );*/

            // Insert to Job Queue
            $position = config('const.PRINTER_POSITIONS.KITCHEN.value');
            //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);

            return OrderResource::collection($orders)->additional([
                'status' => 'success',
                'message' => ''
            ]);
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
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()],
            ];
        }
    }

    /**
     * Order update
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @param OrderRequest $request
     *
     * @return mixed
     */
    public function update(OrderRequest $request, MShop $shop, TOrderGroup $ordergroup)
    {
        try {
            $orders = $this->orderService->updateOrder($request, $shop, $ordergroup);

            return OrderResource::collection($orders)->additional([
                'status' => 'success',
                'message' => ''
            ]);;
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
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()],
            ];
        }
    }

    /**
     * Order Delete
     * @param MShop $shop
     * @param MMenu $menu
     * @param TOrderGroup $ordergroup
     *
     * @return OrderResource
     */
    public function delete(MShop $shop, MMenu $menu, TOrderGroup $ordergroup)
    {
        try {
            $orders = $this->orderService->deleteOrder($shop, $menu, $ordergroup);

            return new OrderResource($orders);
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields'=>'','errorCode'=>'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields'=>'','errorCode'=>'exception','errorMessage' => $e->getMessage()]
            ];
        }
    }
}
