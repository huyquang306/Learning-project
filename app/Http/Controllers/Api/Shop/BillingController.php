<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\BillingRequest;
use App\Http\Resources\Shop\BillingOrdergroupResource;
use App\Http\Resources\Shop\CloseOrderGroupResource;
use App\Http\Resources\Shop\OrderGroupResource;
use App\Http\Resources\Shop\PayOrderGroupResource;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Services\ImageService;
use App\Services\Shop\BillingService;
use App\Services\Shop\OrderGroupService;
use App\Services\PrinterService;
use App\Services\Utils\OrderServiceUtil;
use Illuminate\Http\Request;

class BillingController extends BaseApiController
{
    protected $billingService;
    protected $printerService;
    protected $orderServiceUtil;
    protected $image_service;
    protected $orderGroupService;

    public function __construct(
        BillingService $billingService,
        PrinterService $printerService,
        OrderServiceUtil $orderServiceUtil,
        ImageService $image_service,
        OrderGroupService $orderGroupService
    ) {
        parent::__construct();
        $this->billingService = $billingService;
        $this->printerService = $printerService;
        $this->orderServiceUtil = $orderServiceUtil;
        $this->image_service = $image_service;
        $this->orderGroupService = $orderGroupService;
    }

    /**
     * Checkout ordergroup
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return array
     */
    public function create(MShop $shop, TOrderGroup $ordergroup): array
    {
        $ordergroup = $this->billingService->payRequest($shop, $ordergroup);

        return [
            'status' => 'success',
            'message' => '',
            'data' => new OrderGroupResource($ordergroup),
        ];
    }

    /**
     * Finish billing table
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function close(MShop $shop, TOrderGroup $ordergroup)
    {
        try {
            $result = $this->billingService->finishBilling($shop, $ordergroup);

            return new CloseOrderGroupResource($result);
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => [],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => []
            ];
        }
    }

    /**
     * Calculate shop bill
     *
     * @param MShop $shop
     * @param TOrdergroup $ordergroup
     * @return array
     */
    public function calculate(MShop $shop, TOrdergroup $ordergroup)
    {
        try {
            return [
                'status' => 'success',
                'message' => '',
                'data' => new BillingOrdergroupResource($ordergroup)
            ];
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields' => '', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()]
            ];
        }
    }

    /**
     * Paying request
     *
     * @param BillingRequest $request
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function paying(BillingRequest $request, MShop $shop, TOrderGroup $ordergroup)
    {
        try {
            // Recalculate Course Orders And Update
            $this->orderServiceUtil->recalculateCourseOrdersAndUpdate($ordergroup);

            $flagUpdate = $request->flag;
            $result = $this->billingService->paying($shop, $ordergroup, $flagUpdate);

            return new PayOrderGroupResource($result);
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => [],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => [],
            ];
        }
    }

    /**
     * @param Request     $request
     * @param MShop       $shop
     * @param TOrderGroup $ordergroup
     * @return array
     */
    public function payment(Request $request, MShop $shop, TOrdergroup $ordergroup): array
    {
        try {
            $ordergroup = $this->billingService->payment($shop, $request, $ordergroup);
            $orders = $ordergroup && $ordergroup->tOrders ? $ordergroup->tOrders : [];
            foreach ($orders as $order) {
                $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
                $order->current_price = $currentPrice;
                $order->price_unit = $currentPrice['price_unit_with_tax'];
            }

            $position = config('const.PRINTER_POSITIONS.FRONT.value');
            // Print Bill Detail for Customer
            $outputFileCustomer = $this->printerService->createDetailBillForCustomer($shop, $ordergroup, $orders);
            // Print Bill for Shop
            $outputFileShop = $this->printerService->createBillForShop($shop, $ordergroup, $orders);
            // Insert to Job Queue
            //$this->printerService->insertJobQueue($shop->id, $outputFileCustomer, $position);
            //$this->printerService->insertJobQueue($shop->id, $outputFileShop, $position);

            [$outputPdfFileCustomer, $file_name] = $this->printerService->createDetailBillPdfForCustomer($shop, $ordergroup, $orders);

            // S3 url of invoice
            $s3_path = $this->image_service->s3UploadPdf($shop->id, $outputPdfFileCustomer, $file_name);

            // \File::delete();

            if ($ordergroup) {
                $path = $this->orderGroupService->updateBillPdfFilePath($ordergroup, $s3_path);
            }

            if (!$path) {
                throw new \Exception("Error DB Save For Bill Pdf File Path");
            }

            return [
                'status' => 'success',
                'message' => '',
                'data' => new BillingOrdergroupResource($ordergroup),
            ];
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields' => '', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()]
            ];
        }
    }
}
