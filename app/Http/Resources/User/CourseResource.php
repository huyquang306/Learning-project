<?php

namespace App\Http\Resources\User;

use App\Http\Resources\Shop\MenuByCourseResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $currentPrice = $this->current_price;

        return [
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'name_kana' => $this->name_kana,
            'block_hash_id' => $this->block_hash_id,
            's_image_folder_path' => $this->s_image_folder_path,
            'm_image_folder_path' => $this->m_image_folder_path,
            'l_image_folder_path' => $this->l_image_folder_path,
            'image_file_name' => $this->image_file_name,
            'alert_notification_time' => $this->alert_notification_time,
            'price_unit' => $currentPrice && array_key_exists('price_unit_with_tax', $currentPrice)
                ? $currentPrice['price_unit_with_tax']
                : $this->unit_price,
            'current_price' => $currentPrice,
            'time_block_unit' => $this->time_block_unit,
            'menus' => MenuByCourseResource::collection($this->mMenus),
        ];
    }
}
