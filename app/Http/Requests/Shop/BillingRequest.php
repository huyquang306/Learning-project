<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class BillingRequest extends BaseApiRequest
{
    /**
     * rulesPut
     * handle rule method put
     *
     * @return array
     */
    public function rulesPut(): array
    {
        return [
            'flag' => 'boolean',
        ];
    }

    public function getMessages(): array
    {
        return [];
    }
}
