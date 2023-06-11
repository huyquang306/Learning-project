<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class MenusResource extends JsonResource
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

        $response = [
            'id' => $this->id,
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'price' => $this->price,
            'current_price' => $currentPrice,
            'tax_value' => $this->tax_value,
            'initial_order_flg' => $this->initial_order_flg,
            's_image_folder_path' => $this->s_image_folder_path,
            'm_image_folder_path' => $this->m_image_folder_path,
            'l_image_folder_path' => $this->l_image_folder_path,
            'status' => $this->status,
            'm_menu_category' => CategoryResource::collection($this->rShopMenu->mMenuCategory),
            'estimated_preparation_time' => $this->estimated_preparation_time,
            'is_recommend' => $this->is_recommend,
            'm_tax_id' => $this->m_tax_id,
            'm_tax' => $this->mTax,
            'm_images' => MImageResource::collection($this->mImages),
            'main_image' => $this->mainImage ? new MImageResource($this->mainImage) : null,
            'main_image_path' => $this->mainImage ? $this->mainImage->image_path : null,
        ];
        if ($this->relationLoaded('menuCookPlace')) {
            $response['cook_place'] = $this->menuCookPlace
                ? new CookPlaceResource($this->menuCookPlace)
                : null;
        }
        if ($this->relationLoaded('rShopMenu')) {
            $response['m_shop_business_hour_prices'] = MBusinessHourPriceResource::collection(
                $this->mBusinessHourPrices
            );
        }

        return $response;
    }
}
