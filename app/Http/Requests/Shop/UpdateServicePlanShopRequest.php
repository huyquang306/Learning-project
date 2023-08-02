<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class UpdateServicePlanShopRequest extends BaseApiRequest
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
            'service_plan_id' => 'required|exists:m_service_plan,id',
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
