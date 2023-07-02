<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ServicePlanResource extends JsonResource
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
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'initial_price' => $this->initial_price,
            'type' => $this->type,
            'r_function_conditions' => $this->rFunctionConditions,
        ];
    }
}
