<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class PayOrderGroupResource extends JsonResource
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
            'status' => $this->status,
            'order_blocked' => $this->order_blocked,
            'number_of_customers' => $this->number_of_customers
        ];
    }

    public function with($request)
    {
        return [
            'status' => 'success',
            'message' => ''
        ];
    }
}
