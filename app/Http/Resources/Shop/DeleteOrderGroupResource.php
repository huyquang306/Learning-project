<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class DeleteOrderGroupResource extends JsonResource
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
            'hash_id' => $this->hash_id,
            'status' => $this->status,
            'order_blocked' => $this->order_blocked,
            'number_of_customers' => $this->number_of_customers,
            'deleted_at' => $this->deleted_at,
        ];
    }

    public function with($request): array
    {
        return [
            'status' => 'success',
            'message' => ''
        ];
    }
}
