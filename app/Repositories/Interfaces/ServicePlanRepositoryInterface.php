<?php

namespace App\Repositories\Interfaces;

use App\Models\MServicePlan;
use App\Models\MShop;

interface ServicePlanRepositoryInterface extends BaseRepositoryInterface
{
    public function getFreeServicePlan();

    public function updateServicePlanShop(MShop $shop, string $servicePlanId);

    public function getServicePlansAdmin();

    public function deleteServicePlan(MServicePlan $servicePlan);

    public function getAllServicePlans();
}
