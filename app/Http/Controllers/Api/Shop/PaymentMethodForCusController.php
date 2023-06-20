<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Resources\Shop\PaymentMethodForCusResource;
use App\Models\MShop;
use App\Services\Shop\PaymentMethodForCusService;
use Illuminate\Http\Request;

class PaymentMethodForCusController extends BaseApiController
{
    protected $paymentMethodService;

    public function __construct(PaymentMethodForCusService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }

    /**
     * @param MShop $shop
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(MShop $shop)
    {
        $paymentMethods = $this->paymentMethodService->getPaymentMethodsByShop($shop);

        return $this->responseApi(PaymentMethodForCusResource::collection($paymentMethods));
    }
}
