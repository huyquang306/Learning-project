<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class MenuRecommendResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $category = $this->rShopMenu->mMenuCategory[0];

        return [
            'id' => $this->id,
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'price' => $this->price,
            'current_price' => $this->current_price,
            'status' => $this->status,
            'is_belong_to_course' => $this->is_belong_to_course,
            'category' => new CategoryResource($category),
            'initial_order_flg' => $this->initial_order_flg,
            's_image_path' => $this->s_image_folder_path . $this->image_file_name,
            'm_image_path' => $this->m_image_folder_path . $this->image_file_name,
            'l_image_path' => $this->l_image_folder_path . $this->image_file_name,
            'm_images' => $this->mImages ? MImageResource::collection($this->mImages) : null,
            'main_image' => $this->mainImage ? new MImageResource($this->mainImage) : null,
            'main_image_path' => $this->mainImage ? $this->mainImage->image_path : null,
        ];
    }
}
