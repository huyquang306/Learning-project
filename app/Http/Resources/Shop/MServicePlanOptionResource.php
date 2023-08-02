<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class MServicePlanOptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'm_function_id' => $this->m_function_id,
            'm_service_plan_id' => $this->m_service_plan_id,
            'additional_price' => $this->additional_price,
        ];
    }
}
