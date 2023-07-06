<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
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
            'hash_id' => $this->hash_id,
            'm_shop_id' => $this->m_shop_id,
            'content' => $this->content,
            'businessHourIds' => count($this->mShopBusinessHours)
                ? $this->mShopBusinessHours->pluck('id')->toArray()
                : [] ,
        ];
    }
}
