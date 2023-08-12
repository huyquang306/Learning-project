<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ShopsListRequest;
use App\Http\Requests\Admin\UpdateServicePlanShopRequest;
use App\Http\Resources\Admin\CustomerPaymentResource;
use App\Http\Resources\Admin\ShopListResource;
use App\Http\Resources\Admin\ShopResource;
use App\Models\MShop;
use App\Services\Admin\PaymentService;
use App\Services\Admin\ShopService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopController extends BaseApiController
{
    protected $shopService;
    protected $paymentService;

    public function __construct(ShopService $shopService, PaymentService $paymentService)
    {
        $this->shopService = $shopService;
        $this->paymentService = $paymentService;
    }

    public function index(ShopsListRequest $request): \Illuminate\Http\JsonResponse
    {
        $shops = $this->shopService->getShopsData($request);
        \Log::info($shops);

        return $this->responseApi(new ShopListResource($shops));
    }

    public function show(MShop $shop): \Illuminate\Http\JsonResponse
    {
        $shop = $this->shopService->getShop($shop);

        return $this->responseApi(new ShopResource($shop));
    }

    public function getCustomerPayment(MShop $shop): \Illuminate\Http\JsonResponse
    {
        $customerPayment = $this->paymentService->getCustomerPayment($shop);
        if ($customerPayment) {
            return $this->responseApi(new CustomerPaymentResource($customerPayment));
        }

        return $this->responseApi($customerPayment);
    }

    public function updateShopServicePlan(UpdateServicePlanShopRequest $request, MShop $shop): \Illuminate\Http\JsonResponse
    {
        $shop = $this->shopService->updateShopServicePlan($shop, $request->service_plan_id);

        return $this->responseApi($shop);
    }

    /**
     * Cancel a shop
     *
     * @param MShop $shop
     * @return JsonResponse
     * @throws \Exception
     */
    public function cancelShop(MShop $shop): JsonResponse
    {
        $status = $this->shopService->cancelShop($shop);

        return $this->responseApi((object)[
            'status' => $status,
        ]);
    }

    /**
     * Reopen a shop
     *
     * @param MShop $shop
     * @return JsonResponse
     * @throws \Exception
     */
    public function reopenShop(MShop $shop): JsonResponse
    {
        $status = $this->shopService->reopenShop($shop);

        return $this->responseApi((object)[
            'status' => $status,
        ]);
    }
}
