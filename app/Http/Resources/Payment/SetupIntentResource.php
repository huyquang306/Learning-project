<?php

namespace App\Http\Resources\Payment;

use Illuminate\Http\Resources\Json\JsonResource;

class SetupIntentResource extends JsonResource
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
            'client_secret' => $this->client_secret,
            'description' => $this->description,
            'invoice_prefix' => $this->invoice_prefix,
            'payment_method' => $this->payment_method,
            'payment_method_types' => $this->payment_method_types,
        ];
    }
}
