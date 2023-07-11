<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class RFunctionConditionResource extends JsonResource
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
            'm_condition_type_id' => $this->m_condition_type_id,
            'm_function_id' => $this->m_function_id,
            'is_restricted' => $this->is_restricted,
            'restricted_value' => $this->restricted_value,
            'm_condition_type' => new MConditionTypeResource($this->mConditionType),
            'm_function' => new MFunctionResource($this->mFunction),
        ];
    }
}
