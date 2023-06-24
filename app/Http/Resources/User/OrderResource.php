<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            't_ordergroup_id' => $this->t_ordergroup_id,
            'r_shop_menu_id' => $this->r_shop_menu_id,
            'status' => $this->status,
            'quantity' => $this->quantity,
            'ordered_at' => $this->ordered_at,
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
