<?php

namespace App\Http\Controllers\Api\User;

use App\Events\OrderPaymentRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\BillingOrdergroupResource;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Services\User\BillingService;
use App\Services\User\PrinterService;
use App\Services\Utils\OrderServiceUtil;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    protected $billingService;
    protected $printerService;
    protected $orderServiceUtil;

    public function __construct(
        BillingService $billingService,
        PrinterService $printerService,
        OrderServiceUtil $orderServiceUtil
    ) {
        $this->billingService = $billingService;
        $this->printerService = $printerService;
        $this->orderServiceUtil = $orderServiceUtil;
    }

    /**
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return array
     */
    public function calculate(MShop $shop, TOrderGroup $ordergroup): array
    {
        OrderPaymentRequest::dispatch($shop);
        return [
            "status" => "success",
            "message" => "",
            'data' => new BillingOrdergroupResource($ordergroup)
        ];
    }

    /**
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return array
     */
    public function payRequest(MShop $shop, TOrderGroup $ordergroup): array
    {
        // Recalculate Course Orders And Update
        $this->orderServiceUtil->recalculateCourseOrdersAndUpdate($ordergroup);

        $ordergroup->load('tOrders');
        $ordergroup = $this->billingService->updateRequestCheckout($ordergroup);
        $orders = [];
        if ($ordergroup->tOrders) {
            $orders = $ordergroup->tOrders
                ->load([
                    'rShopMenu.mMenu',
                    'rShopCourse.mCourse',
                ]);
            foreach ($orders as $order) {
                $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
                $order->current_price = $currentPrice;
                $order->price_unit = $currentPrice['price_unit_with_tax'];
            }
        }

        // Print invoice detail
        //$outputFile = $this->printerService->createPaymentRequestCheckoutTemplate($shop, $ordergroup, $orders);
        //$position = config('const.PRINTER_POSITIONS.KITCHEN.value');
        // Insert to Job Queue
        //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);

        return [
            "status" => "success",
            "message" => "",
            'data' => new BillingOrdergroupResource($ordergroup)
        ];
    }
}
