<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
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
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'postal_code' => $this->postal_code,
            'prefecture' => $this->prefecture,
            'city' => $this->city,
            'address' => $this->address,
            'building' => $this->building,
            'phone_number' => $this->phone_number,
            'fax_number' => $this->fax_number,
            'email' => $this->email,
            'lat' => $this->lat,
            'lon' => $this->lon,
            'opened' => $this->opened,
            'open_date' => $this->open_date,
            'close_date' => $this->close_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'items' => $this->items,
            'genres' => $this->genres,
        ];
    }
}
