<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseAPIRequest;
use Illuminate\Foundation\Http\FormRequest;

class ShopCookPlaceRequest extends BaseAPIRequest
{
    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        $shop = $this->shop;

        return [
            'name' => [
                'string',
                'max:50',
                Rule::unique('m_shop_cook_place', 'name')
                    ->where(function ($query) use ($shop) {
                        $query->where('m_shop_id', $shop->id);
                    })->whereNull('deleted_at'),
            ],
        ];
    }

    /**
     * rulesPut
     * handle rule method put
     *
     * @return array
     */
    public function rulesPut(): array
    {
        $shop = $this->shop;
        $cookPlace = $this->cook_place;

        return [
            'name' => [
                'string',
                'max:32',
                Rule::unique('m_shop_cook_place', 'name')
                    ->where(function ($query) use ($shop) {
                        $query->where('m_shop_id', $shop->id);
                    })
                    ->ignore($cookPlace->id, 'id')
                    ->whereNull('deleted_at'),
            ],
        ];
    }

    public function getMessages(): array
    {
        return [];
    }
}
