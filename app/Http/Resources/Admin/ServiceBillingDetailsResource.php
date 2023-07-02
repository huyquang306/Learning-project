<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Resources\Json\JsonResource;

class ServiceBillingDetailsResource extends JsonResource
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
            'hash_id' => $this->hash_id,
            't_service_billing_id' => $this->t_service_billing_id,
            'service_id' => $this->service_id,
            'service_type' => $this->service_type,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'fee_type' => $this->fee_type,
            'type' => $this->type,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
