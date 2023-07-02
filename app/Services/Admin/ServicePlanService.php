<?php

namespace App\Services\Admin;

use App\Models\MServicePlan;
use App\Repositories\LimitConditionRepository;
use App\Repositories\ServicePlanConditionRepository;
use App\Repositories\ServicePlanRepository;
use App\Repositories\Interfaces\RFunctionConditionRepositoryInterface as RFunctionConditionRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServicePlanService
{
    protected $servicePlanRepo;
    protected $servicePlanConditionRepo;
    protected $limitConditionRepo;
    protected $rFunctionConditionRepo;

    /**
     * ServicePlanService constructor.
     *
     * @param ServicePlanRepository          $servicePlanRepo
     * @param ServicePlanConditionRepository $servicePlanConditionRepo
     * @param LimitConditionRepository       $limitConditionRepo
     */
    public function __construct(
        ServicePlanRepository $servicePlanRepo,
        ServicePlanConditionRepository $servicePlanConditionRepo,
        LimitConditionRepository $limitConditionRepo,
        RFunctionConditionRepository $rFunctionConditionRepo
    ) {
        $this->servicePlanRepo = $servicePlanRepo;
        $this->servicePlanConditionRepo = $servicePlanConditionRepo;
        $this->limitConditionRepo = $limitConditionRepo;
        $this->rFunctionConditionRepo = $rFunctionConditionRepo;
    }

    /**
     * Get all service plans
     *
     * @return array
     */
    public function getServicePlansData()
    {
        return $this->servicePlanRepo->getServicePlansAdmin();
    }

    /**
     * Create a new service plan
     *
     * @param Request $request
     * @return array
     */
    public function create(Request $request)
    {
        $servicePlanData = $request->only([
            'name',
            'description',
            'price',
            'initial_price',
        ]);
        $servicePlanData['hash_id'] = $this->servicePlanRepo->makeHashId();
        try {
            DB::beginTransaction();
            $servicePlan = $this->servicePlanRepo->create($servicePlanData);

            $conditions = $request->r_service_plan_conditions;
            foreach ($conditions as $condition) {
                $limitConditionData = [
                    'name' => $condition['m_limit_condition']['name'],
                    'description' => $condition['m_limit_condition']['description'],
                    'min_value' => $condition['m_limit_condition']['min_value'],
                    'max_value' => $condition['m_limit_condition']['max_value'],
                    'extend_price' => $condition['m_limit_condition']['extend_price'],
                ];
                $limitCondition = $this->limitConditionRepo->create($limitConditionData);

                $mFunctionConditionId = $condition['m_function_condition_id'];
                $this->servicePlanConditionRepo->create([
                    'm_service_plan_id' => $servicePlan->id,
                    'm_limit_condition_id' => $limitCondition->id,
                    'm_function_condition_id' => $mFunctionConditionId,
                ]);
            }
            DB::commit();

            return $servicePlan->load([
                'rServicePlanConditions.mFunctionCondition',
                'rServicePlanConditions.mLimitCondition',
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return null;
        }
    }

    /**
     * Update a service plan
     *
     * @param Request      $request
     * @param MServicePlan $servicePlan
     * @return array
     */
    public function update(Request $request, MServicePlan $servicePlan)
    {
        try {
            DB::beginTransaction();
            $servicePlanData = $request->only([
                'name',
                'description',
                'price',
                'initial_price',
            ]);
            $servicePlan = $this->servicePlanRepo->update($servicePlan->id, $servicePlanData);
            $servicePlan->load([
                'rFunctionConditions.mFunction.mServicePlanOptions' => function (
                    $mServicePlanOptionQuery
                ) use ($servicePlan) {
                    $mServicePlanOptionQuery->where('m_service_plan_id', $servicePlan->id);
                },
            ]);

            $requestFunctionConditions = $request->r_function_conditions;
            $createFunctionConditions = [];
            $updateFunctionConditions = [];

            foreach ($requestFunctionConditions as $functionCondition) {
                if (array_key_exists('id', $functionCondition)
                    && is_null($functionCondition['id'])) {
                    $createFunctionConditions[] = $functionCondition;
                    continue;
                }

                if (array_key_exists('id', $functionCondition)
                    && $servicePlan->rFunctionConditions->contains($functionCondition['id'])) {
                    $updateFunctionConditions[] = $functionCondition;
                }
            }

            // Update relations
            foreach ($updateFunctionConditions as $functionCondition) {
                $this->rFunctionConditionRepo->update(
                    $functionCondition['id'],
                    collect($functionCondition)->only([
                        'is_restricted',
                        'restricted_value',
                        'm_function_id',
                        'm_condition_type_id',
                    ])->all()
                );

                $additionalPrice = count($functionCondition['m_function']['m_service_plan_options'])
                && array_key_exists('additional_price', $functionCondition['m_function']['m_service_plan_options'][0])
                    ? $functionCondition['m_function']['m_service_plan_options'][0]['additional_price']
                    : 0;
                $servicePlan->mFunctions()->updateExistingPivot(
                    $functionCondition['m_function_id'],
                    [
                        'additional_price' => $additionalPrice,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            // Create new relations
            foreach ($createFunctionConditions as $functionCondition) {
                $newFunctionCondition = $this->rFunctionConditionRepo->create(
                    collect($functionCondition)->only([
                        'is_restricted',
                        'restricted_value',
                        'm_function_id',
                        'm_condition_type_id',
                    ])->all()
                );

                // Create relation between service plan and condition
                $servicePlan->rFunctionConditions()->attach(
                    $newFunctionCondition->id,
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );

                // Create relation between service plan and function
                $additionalPrice = count($functionCondition['m_function']['m_service_plan_options'])
                && array_key_exists('additional_price', $functionCondition['m_function']['m_service_plan_options'][0])
                    ? $functionCondition['m_function']['m_service_plan_options'][0]['additional_price']
                    : 0;
                if (!$servicePlan->mFunctions()
                    ->wherePivot('m_function_id', $functionCondition['m_function_id'])
                    ->count()
                ) {
                    $servicePlan->mFunctions()->attach(
                        $functionCondition['m_function_id'],
                        [
                            'additional_price' => $additionalPrice,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                } else {
                    $servicePlan->mFunctions()->updateExistingPivot(
                        $functionCondition['m_function_id'],
                        [
                            'additional_price' => $additionalPrice,
                            'updated_at' => now(),
                        ]
                    );
                }
            }

            // Delete relations
            $removeFunctionConditionIds = array_diff(
                $servicePlan->rFunctionConditions->pluck('id')->toArray(),
                collect($requestFunctionConditions)->pluck('id')->toArray()
            );

            if (count($removeFunctionConditionIds)) {
                foreach ($removeFunctionConditionIds as $removeFunctionConditionId) {
                    $servicePlan->rFunctionConditions()->detach($removeFunctionConditionId);
                    $removeFunctionCondition = $this->rFunctionConditionRepo->find($removeFunctionConditionId);
                    $removeFunction = $removeFunctionCondition->mFunction;
                    $servicePlan->mFunctions()->wherePivot('m_service_plan_id', $servicePlan->id)
                        ->wherePivot('m_function_id', $removeFunction->id)
                        ->detach();

                    $this->rFunctionConditionRepo->delete($removeFunctionConditionId);
                }
            }

            DB::commit();

            return $servicePlan->load([
                'rFunctionConditions.mConditionType',
            ])->load([
                'rFunctionConditions.mFunction.mServicePlanOptions' => function ($query) use ($servicePlan) {
                    $query->where('m_service_plan_id', $servicePlan->id);
                },
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return $servicePlan->load([
                'rFunctionConditions.mConditionType',
            ])->load([
                'rFunctionConditions.mFunction.mServicePlanOptions' => function ($query) use ($servicePlan) {
                    $query->where('m_service_plan_id', $servicePlan->id);
                },
            ]);
        }
    }

    /**
     * Delete a service plan
     *
     * @param MServicePlan $servicePlan
     * @return boolean
     */
    public function destroy(MServicePlan $servicePlan)
    {
        return $this->servicePlanRepo->deleteServicePlan($servicePlan);
    }
}
