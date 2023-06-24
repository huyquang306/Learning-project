<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class ShopTaxResource extends JsonResource
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
            'm_currency_id' => $this->m_currency_id,
            'mCurrency' => $this->mCurrency,
            'price_fraction_mode' => $this->price_fraction_mode,
            'total_amount_fraction_mode' => $this->total_amount_fraction_mode,
            'price_display_mode' => $this->price_display_mode,
            'serve_charge_rate' => $this->serve_charge_rate,
            'serve_charge_in_use' => $this->serve_charge_in_use,
            'payment_method_ids' => $this->payment_methods && count($this->payment_methods)
                ? $this->payment_methods->pluck('id')->values()
                : [],
        ];
    }
}
