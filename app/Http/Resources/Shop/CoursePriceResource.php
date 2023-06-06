<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class CoursePriceResource extends JsonResource
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
            'hash_id' => $this->hash_id,
            'block_time_start' => $this->block_time_start
                ? Carbon::createFromFormat('H:i:s', $this->block_time_start)->format('H:i')
                : null,
            'block_time_finish' => $this->block_time_finish
                ? Carbon::createFromFormat('H:i:s', $this->block_time_finish)->format('H:i')
                : null,
            'unit_price' => $this->unit_price,
            'tax_value' => $this->tax_value,
            'tax_rate' => $this->mTax ? $this->mTax->tax_rate : 0,
            'm_tax_id' => $this->m_tax_id,
            'm_tax' => new MTaxResource($this->mTax),
            'status' => $this->status,
        ];
    }
}
