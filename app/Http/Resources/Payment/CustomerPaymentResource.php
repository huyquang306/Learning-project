<?php

namespace App\Http\Resources\Payment;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerPaymentResource extends JsonResource
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
            'object' => $this->object,
            'created' => $this->created,
            'email' => $this->email,
            'name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->metadata->address,
            'zip_code' => $this->metadata->zip_code,
            'description' => $this->description,
            'invoice_prefix' => $this->invoice_prefix,
            'payment_method' => $this->payment_method,
            'payment_method_types' => $this->payment_method_types,
        ];
    }
}
