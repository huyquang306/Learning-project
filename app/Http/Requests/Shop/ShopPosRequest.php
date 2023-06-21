<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class ShopPosRequest extends BaseApiRequest
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
            'price_fraction_mode' => 'required|numeric|between:0,2',
            'total_amount_fraction_mode' => 'required|numeric|between:0,2',
            'price_display_mode' => 'required|numeric|between:0,1',
            'serve_charge_rate' => 'required|numeric',
            'serve_charge_in_use' => 'required|boolean',
            'payment_method_ids' => 'required|array|min:1',
            'payment_method_ids.*' => 'required|numeric|exists:m_payment_method,id',
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
