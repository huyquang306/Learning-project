<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Resources\Payment\CustomerPaymentResource;
use App\Http\Resources\Payment\SetupIntentResource;
use App\Models\MShop;
use App\Services\Shop\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\ApiErrorException;

class PaymentController extends BaseApiController
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function getCustomerPayment(MShop $shop): JsonResponse
    {
        $customerPayment = $this->paymentService->getCustomerPayment($shop);
        if ($customerPayment) {
            return $this->responseApi(new CustomerPaymentResource($customerPayment));
        }

        return $this->responseApi($customerPayment);
    }

    /**
     * Get or create customer payment in stripe
     *
     * @param Request $request
     * @param MShop $shop
     * @return JsonResponse
     * @throws ApiErrorException
     */
    public function registerOrUpdateCustomerPayment(Request $request, MShop $shop): JsonResponse
    {
        $customerPayment = $this->paymentService->createOrUpdateCustomerPayment($request, $shop);

        return $this->responseApi(new CustomerPaymentResource($customerPayment));
    }

    public function setupPaymentMethod(MShop $shop): JsonResponse
    {
        $setupIntent = $this->paymentService->setupIntent($shop);
        if ($setupIntent) {
            return $this->responseApi(new SetupIntentResource($setupIntent));
        }

        return $this->responseApi($setupIntent);
    }

    public function registerPaymentMethod(Request $request, MShop $shop): JsonResponse
    {
        $status = $this->paymentService->registerPaymentMethod($shop, $request->payment_method);

        return $this->responseApi([
            'status' => $status,
        ]);
    }

    public function activeCard(Request $request, MShop $shop): JsonResponse
    {
        $this->paymentService->activeCard($request, $shop);

        return $this->responseApi([
            'status' => true,
        ]);
    }
}
