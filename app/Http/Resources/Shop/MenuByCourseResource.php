<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class MenuByCourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $currentPrice = getMenuPriceHelper($this);
        if ($this->relationLoaded('rShopMenu')) {
            $rShopMenu = $this->rShopMenu;
            $categories = $rShopMenu->mMenuCategory;
        } else {
            $rShopMenu = $this->rShopMenu()->first();
            $categories = $rShopMenu->mMenuCategory()->orderBy('tier_number', 'DESC')->get();
        }

        return [
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'price' => $currentPrice['price_unit_with_tax'],
            'current_price' => $currentPrice,
            'initial_order_flg' => $this->initial_order_flg,
            's_image_folder_path' => $this->s_image_folder_path,
            'm_image_folder_path' => $this->m_image_folder_path,
            'l_image_folder_path' => $this->l_image_folder_path,
            'image_file_name' => $this->image_file_name,
            'review_rate' => $this->review_rate,
            'status' => $this->pivot->status,
            'm_menu_category' => CategoryResource::collection($categories),
            'course_menu_status' => $this->pivot ? $this->pivot->status : null,
            'm_images' => MImageResource::collection($this->mImages),
            'main_image' => $this->mainImage ? new MImageResource($this->mainImage) : null,
            'main_image_path' => $this->mainImage ? $this->mainImage->image_path : null,
        ];
    }
}
