<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\UpdateServicePlanShopRequest;
use App\Http\Resources\Shop\ServicePlanResource;
use App\Http\Resources\Shop\ShopResource;
use App\Models\MShop;
use App\Services\Shop\ServicePlanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ServicePlanController extends BaseApiController
{
    protected $servicePlanService;

    /**
     * ServicePlanController constructor.
     * @param ServicePlanService $servicePlanService
     */
    public function __construct(ServicePlanService $servicePlanService)
    {
        $this->servicePlanService = $servicePlanService;
    }

    /**
     * Get list all service_plans
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $results = $this->servicePlanService->getList();

        return $this->responseApi(ServicePlanResource::collection($results));
    }

    /**
     * Update current service plan of shop
     * @param UpdateServicePlanShopRequest $request
     * @param MShop                        $shop
     *
     * @return JsonResponse
     */
    public function update(UpdateServicePlanShopRequest $request, MShop $shop): JsonResponse
    {
        $shop = $this->servicePlanService->updateServicePlanShop($shop, $request->service_plan_id);

        return $this->responseApi(new ShopResource($shop));
    }
}
