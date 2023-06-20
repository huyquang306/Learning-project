<?php

namespace App\Http\Resources\Shop;

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
            ];
        }

        // Get all data course
        $course = null;
        if ($rShopCourse = $this->rShopCourse()->withTrashed()->first()) {
            $course = $rShopCourse->mCourse()->withTrashed()->first();
        }

        $name = null;
        if ($this->order_type === config('const.ORDER_TYPE.ORDER_WITHOUT_MENU')) {
            $name = $this->menu_name;
        } elseif ($this->r_shop_menu_id && $this->rShopMenu && $this->rShopMenu->mMenu) {
            $name = $this->rShopMenu->mMenu->name;
        } elseif ($course) {
            $name = $course->name;
        }

        $hashId = null;
        if ($this->r_shop_menu_id && $this->rShopMenu && $this->rShopMenu->mMenu) {
            $hashId = $this->rShopMenu->mMenu->hash_id;
        } elseif ($course) {
            $hashId = $course->hash_id;
        }

        return [
            'id' => $this->id,
            'status' => $this->status,
            'quantity' => $this->quantity,
            'ordered_at' => $this->ordered_at,
            'hash_id' => $hashId,
            'name' => $name,
            'price' => $currentPrice['price_unit_with_tax'],
            'current_price' => $currentPrice,
            's_image_folder_path' => $this->r_shop_menu_id ? $this->rShopMenu->mMenu->s_image_folder_path : null,
            'm_image_folder_path' => $this->r_shop_menu_id ? $this->rShopMenu->mMenu->m_image_folder_path : null,
            'l_image_folder_path' => $this->r_shop_menu_id ? $this->rShopMenu->mMenu->l_image_folder_path :null,
            'image_file_name' => $this->r_shop_menu_id ? $this->rShopMenu->mMenu->image_file_name : null,
            'review_rate' => $this->r_shop_menu_id ? $this->rShopMenu->mMenu->review_rate : null,
            'amount' => $this->amount,
            'order_type' => $this->order_type,
            'tax_value' => $this->tax_value,
            'tax_rate' => $this->tax_rate,
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
