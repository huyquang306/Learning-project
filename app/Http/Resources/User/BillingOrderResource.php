<?php

namespace App\Http\Resources\User;

use App\Models\TOrder;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingOrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $currentPrice = getMenuPriceHelper($this, config('const.function_helper.menu_price.order_type'));
        if ($this->order_type === TOrder::SERVICE_FEE_TYPE_VALUE) {
            return [
                'id' => $this->id,
                'status' => $this->status,
                'quantity' => $this->quantity,
                'ordered_at' => $this->ordered_at,
                'hash_id' => null,
                'name' => config('const.ORDER_SERVICE_FEE_NAME'),
                'name_kana' => config('const.ORDER_SERVICE_FEE_NAME'),
                'price' => $currentPrice['price_unit_with_tax'],
                'current_price' => $currentPrice,
                's_image_folder_path' => null,
                'm_image_folder_path' => null,
                'l_image_folder_path' => null,
                'image_file_name' => null,
                'review_rate' => null,
                'amount' => $this->amount,
                'order_type' => $this->order_type,
                'tax_value' => $this->tax_value,
                'tax_rate' => $this->tax_rate,
                'torder_price_unit' => $currentPrice['price_unit_with_tax'],
                'm_course' => null,
                'm_images' => null,
                'main_image' => null,
                'main_image_path' => null,
            ];
        }
        $mMenu = $this->rShopMenu ? $this->rShopMenu->mMenu : null;
        $mCourse = $this->rShopCourse ? $this->rShopCourse->mCourse : null;

        $name = null;
        if ($this->order_type === config('const.ORDER_TYPE.ORDER_WITHOUT_MENU')) {
            $name = $this->menu_name;
        } elseif ($mMenu) {
            $name = $mMenu->name;
        } elseif ($mCourse) {
            $name = $mCourse->name;
        }

        return [
            'id' => $this->id,
            'status' => $this->status,
            'torder_price_unit' => $this->price_unit,
            'ordered_at' => $this->ordered_at,
            'hash_id' => $mMenu ? $mMenu->hash_id : ($mCourse ? $mCourse->hash_id : null),
            'name' => $name,
            'name_kana' => $mMenu ? $mMenu->name_kana : ($mCourse ? $mCourse->name : null),
            'price' => $currentPrice['price_unit_with_tax'],
            'current_price' => $currentPrice,
            'quantity' => $this->quantity,
            'amount' => $this->amount,
            'order_type' => $this->order_type,
            'm_course' => $mCourse,
            'is_menu_in_course' => $this->isMenuInSourse,
            's_image_folder_path' => $mMenu ? $mMenu->s_image_folder_path : null,
            'm_image_folder_path' => $mMenu ? $mMenu->m_image_folder_path : null,
            'l_image_folder_path' => $mMenu ? $mMenu->l_image_folder_path : null,
            'image_file_name' => $mMenu ? $mMenu->image_file_name : null,
            'review_rate' => $mMenu ? $mMenu->review_rate : null,
            'm_images' => $mMenu ? MImageResource::collection($mMenu->mImages) : null,
            'main_image' => $mMenu && $mMenu->mainImage ? new MImageResource($mMenu->mainImage) : null,
            'main_image_path' => $mMenu && $mMenu->mainImage ? $mMenu->mainImage->image_path : null,
        ];
    }

    public function with($request)
    {
        return [
            'status' => 'success',
            'message' => ''
        ];
    }
}
