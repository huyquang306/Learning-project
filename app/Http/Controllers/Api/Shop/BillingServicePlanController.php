<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Models\MShop;
use App\Services\Shop\BillingServicePlanService;
use Illuminate\Http\JsonResponse;

class BillingServicePlanController extends BaseApiController
{
    protected $billingService;

    /**
     * BillingServicePlanController constructor.
     * @param BillingServicePlanService $billingService
     */
    public function __construct(
        BillingServicePlanService $billingService
    ) {
        parent::__construct();
        $this->billingService = $billingService;
    }

    /**
     * Show detail billing payment history
     *
     * @param MShop $shop
     * @return JsonResponse
     */
    public function show(MShop $shop): JsonResponse
    {
        return $this->responseApi($this->billingService->showDetailHistories($shop));
    }
}
