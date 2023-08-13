<?php

namespace App\Repositories;

use App\Models\MServicePlan;
use App\Models\MShop;
use App\Models\RShopServicePlan;
use App\Repositories\Interfaces\ServicePlanRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;

class ServicePlanRepository extends BaseRepository implements ServicePlanRepositoryInterface
{
    /**
     * get model
     * @return string
     */
    public function getModel()
    {
        return MServicePlan::class;
    }

    public function getFreeServicePlan()
    {
        $freePlan = $this->model
            ->where('price', 0)
            ->with('rFunctionConditions.mConditionType')
            ->first();

        return $freePlan->load([
            'rFunctionConditions.mFunction.mServicePlanOptions' => function ($mServicePlanOptionQuery) use ($freePlan) {
                $mServicePlanOptionQuery->where('m_service_plan_id', $freePlan->id);
            },
        ]);
    }

    public function updateServicePlanShop(MShop $shop, string $servicePlanId)
    {
        $shop->load([
            'mServicePlans' => function ($query) {
                $query->where('status', RShopServicePlan::ACTIVE_STATUS);
            },
        ]);
        // Check update to current plan
        if ($shop->mServicePlans->count() && $shop->mServicePlans->first()->id === (int) $servicePlanId) {
            return $shop;
        }

        $freePlan = $this->getFreeServicePlan();
        $currentPlan = $shop-mServicePlans->filter(
            function ($item) {
                return ($item->end_date === null && $item->applied_date <= now())
                    || $item->end_date == now()->endOfMonth();
            }
        )->first();
        $newServicePlan = $this->find($servicePlanId);

        if (
            ((int) $servicePlanId === $freePlan->id && $currentPlan->id !== $freePlan->id)
            || ($currentPlan->price < $newServicePlan->price)
        ) {
            RShopServicePlan::where('m_shop_id', $shop->id)
                ->where('status', RShopServicePlan::ACTIVE_STATUS)
                ->update([
                    'status' => RShopServicePlan::CANCEL_STATUS,
                    'end_date' => now(),
                ]);
            $shop->mServicePlans()->attach($servicePlanId, [
                'status' => RShopServicePlan::ACTIVE_STATUS,
                'applied_date' => now()->startOfMonth(),
                'registered_date' => now(),
            ]);
        } else {
            // Update older service plan
            RShopServicePlan::where('m_shop_id', $shop->id)
                ->where('status', RShopServicePlan::ACTIVE_STATUS)
                ->update([
                    'status' => RShopServicePlan::CANCEL_STATUS,
                ]);
            // Update end_date to now when upgrade other plans
            RShopServicePlan::where('m_shop_id', $shop->id)
                ->whereNull('end_date')
                ->update([
                    'end_date' => now()->endOfMonth(),
                ]);

            // Create a new plan for shop
            $shop->mServicePlans()->attach($servicePlanId, [
                'status' => RShopServicePlan::ACTIVE_STATUS,
                'applied_date' => now()->addMonth()->startOfMonth(),
                'registered_date' => now(),
            ]);
        }

        $shop->load([
            'mBusinessHours',
            'mShopMetas',
            'mServicePlans',
        ]);

        return $shop;
    }

    public function getServicePlansAdmin()
    {
        $servicePlanList = $this->model
            ->with('rFunctionConditions.mConditionType')
            ->paginate(config('const.pagination.SHOPS_PAGINATION'));

        foreach ($servicePlanList->items() as $servicePlan) {
            $servicePlan->load([
                'rFunctionConditions.mFunction.mServicePlanOptions' => function (
                    $mServicePlanOptionQuery
                ) use ($servicePlan) {
                    $mServicePlanOptionQuery->where('m_service_plan_id', $servicePlan->id);
                },
            ]);
        }

        return $servicePlanList;
    }

    /**
     * Delete a service plan
     *
     * @param MServicePlan $servicePlan
     * @return boolean
     */
    public function deleteServicePlan(MServicePlan $servicePlan)
    {
        try {
            DB::beginTransaction();
            $item = $this->model->find($servicePlan->id);
            if ($item) {
                $servicePlanConditions = $item->rServicePlanConditions();
                foreach ($servicePlanConditions->get() as $servicePlanCondition) {
                    $servicePlanCondition->mLimitCondition()->delete();
                }
                $servicePlanConditions->delete();
                $item->delete();
                DB::commit();

                return true;
            }

            return false;
        } catch (Exception $e) {
            DB::rollBack();

            return false;
        }
    }

    /**
     * Get all service plans
     */
    public function getAllServicePlans()
    {
        $servicePlans = $this->model->with([
            'rFunctionConditions.mConditionType',
        ])->get();
        foreach ($servicePlans as $servicePlan) {
            $servicePlan->load([
                'rFunctionConditions.mFunction.mServicePlanOptions' => function (
                    $mServicePlanOptionQuery
                ) use ($servicePlan) {
                    $mServicePlanOptionQuery->where('m_service_plan_id', $servicePlan->id);
                },
            ]);
        }

        return $servicePlans;
    }
}
