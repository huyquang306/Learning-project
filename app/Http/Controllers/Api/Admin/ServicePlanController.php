<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServicePlanRequest;
use App\Http\Resources\Admin\ServicePlanResource;
use App\Models\MServicePlan;
use App\Services\Admin\ServicePlanService;
use Illuminate\Http\JsonResponse;

class ServicePlanController extends BaseApiController
{
    protected $servicePlanService;

    public function __construct(ServicePlanService $servicePlanService)
    {
        $this->servicePlanService = $servicePlanService;
    }

    /**
     * Get all service plans
     *
     * @return JsonResponse
     */
    public function index()
    {
        $servicePlans = $this->servicePlanService->getServicePlansData();

        return $this->responseApi(ServicePlanResource::collection($servicePlans));
    }

    /**
     * Create a new service plan
     *
     * @param ServicePlanRequest $request
     * @return JsonResponse
     */
    public function store(ServicePlanRequest $request)
    {
        $servicePlan = $this->servicePlanService->create($request);

        return $this->responseApi(new ServicePlanResource($servicePlan));
    }

    /**
     * Update a service plan
     *
     * @param ServicePlanRequest $request
     * @param MServicePlan       $servicePlan
     * @return JsonResponse
     */
    public function update(ServicePlanRequest $request, MServicePlan $servicePlan)
    {
        $servicePlan = $this->servicePlanService->update($request, $servicePlan);

        return $this->responseApi(new ServicePlanResource($servicePlan));
    }

    /**
     * Delete a service plan
     *
     * @param MServicePlan $servicePlan
     * @return JsonResponse
     */
    public function destroy(MServicePlan $servicePlan)
    {
        $result = $this->servicePlanService->destroy($servicePlan);

        return $this->responseApi($result);
    }
}
