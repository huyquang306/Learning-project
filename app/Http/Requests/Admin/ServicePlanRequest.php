<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseApiRequest;

class ServicePlanRequest extends BaseApiRequest
{
    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        return [
            'name' => 'required|string|max:50',
            'description' => 'required|string|max:500',
            'price' => 'required|numeric|min:0|max:1000000000',
            'initial_price' => 'required|numeric|min:0|max:1000000000',

            'r_service_plan_conditions' => 'required|array',
            'r_service_plan_conditions.*.m_function_condition_id' => 'required|numeric',

            'r_service_plan_conditions.*.m_limit_condition.name' => 'required|string|max:50',
            'r_service_plan_conditions.*.m_limit_condition.description' => 'nullable|string|max:500',
            'r_service_plan_conditions.*.m_limit_condition.max_value' => 'nullable|numeric|min:0|max:1000000000',
            'r_service_plan_conditions.*.m_limit_condition.min_value' => 'nullable|numeric',
            'r_service_plan_conditions.*.m_limit_condition.extend_price' => 'numeric|min:0|max:1000000000',
        ];
    }

    public function rulesPut(): array
    {
        return [
            'name' => 'required|string|max:50',
            'description' => 'required|string|max:500',
            'price' => 'required|numeric|min:0|max:1000000000',
            'initial_price' => 'required|numeric|min:0|max:1000000000',

            'r_function_conditions' => 'required|array',
            'r_function_conditions.*.m_function_id' => 'required|numeric|exists:m_function,id',
            'r_function_conditions.*.m_condition_type_id' => 'required|numeric|exists:m_condition_type,id',
            'r_function_conditions.*.is_restricted' => 'required|boolean',
            'r_function_conditions.*.restricted_value' => 'required|numeric|min:0|max:1000000000',

            'r_function_conditions.*.m_function' => 'required|array',
            'r_function_conditions.*.m_function.m_service_plan_options' => 'required|array',
            'r_function_conditions.*.m_function.m_service_plan_options.*.additional_price' => 'required|numeric|min:0|max:1000000000',
        ];
    }

    /**
     * Custom message for rules
     *
     * @return array
     */
    public function getMessages(): array
    {
        return [];
    }
}
