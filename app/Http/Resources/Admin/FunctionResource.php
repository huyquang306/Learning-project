<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class FunctionResource extends JsonResource
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
            'name' => $this->name,
            'code' => $this->code,
            'object_type' => $this->object_type,
            'object' => $this->object,
            'r_function_conditions' => $this->rFunctionConditions,
            'created_at' => $this->created_at,
        ];
    }
}
