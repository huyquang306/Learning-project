<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class MFunctionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'object' => $this->object,
            'object_type' => $this->object_type,
            'm_service_plan_options' => MServicePlanOptionResource::collection($this->mServicePlanOptions),
        ];
    }
}
