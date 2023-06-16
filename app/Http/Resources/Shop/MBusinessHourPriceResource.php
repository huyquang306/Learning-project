<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class MBusinessHourPriceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'r_shop_menu_id' => $this->r_shop_menu_id,
            'm_shop_business_hour_id' => $this->m_shop_business_hour_id,
            'm_shop_business_hour' => $this->mShopBusinessHour,
            'price' => $this->price,
            'tax_value' => $this->tax_value,
            'display_flg' => $this->display_flg,
        ];
    }
}
