<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'm_shop_id' => $this->m_shop_id,
            'code' => $this->code,
            'name' => $this->name,
            'short_name' => $this->short_name,
            'tier_number' => $this->tier_number,
            'parent_id' => $this->parent_id
        ];
    }

    /**
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function with($request)
    {
        return [
            'status' => 'success',
            'message' => ''
        ];
    }
}
