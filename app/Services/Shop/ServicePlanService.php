<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Models\RShopServicePlan;
use App\Repositories\Interfaces\ServicePlanRepositoryInterface;
use Illuminate\Http\JsonResponse;

class ServicePlanService
{
    protected $servicePlanRepository;

    /**
     * ServicePlanService constructor.
     * @param ServicePlanRepositoryInterface $servicePlanRepository
     */
    public function __construct(ServicePlanRepositoryInterface $servicePlanRepository)
    {
        $this->servicePlanRepository = $servicePlanRepository;
    }

    /**
     * List service_plans in system
     *
     * @param  MShop $shop
     * @return \Illuminate\Support\Collection
     */
    public function getList()
    {
        $servicePlans = $this->servicePlanRepository->getAll();
        foreach ($servicePlans as $servicePlan) {
            $servicePlan->load([
                'rFunctionConditions.mConditionType',
            ])->load([
                'rFunctionConditions.mFunction.mServicePlanOptions' => function (
                    $mServicePlanOptionQuery
                ) use ($servicePlan) {
                    $mServicePlanOptionQuery->where('m_service_plan_id', $servicePlan->id);
                },
            ]);
        }

        return $servicePlans;
    }

    /**
     * Update current service plan of shop
     * @param MShop  $shop
     * @param string $servicePlanId
     *
     * @return mixed
     */
    public function updateServicePlanShop(MShop $shop, string $servicePlanId)
    {
        return $this->servicePlanRepository->updateServicePlanShop($shop, $servicePlanId);
    }

    public function getFreeServicePlan()
    {
        return $this->servicePlanRepository->getFreeServicePlan();
    }
}
