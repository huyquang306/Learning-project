<?php

namespace App\Http\Resources\Shop;

use App\Models\TOrder;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorySummaryOrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $orderCurrentPrice = getMenuPriceHelper($this, config('const.function_helper.menu_price.order_type'));

        $menu = null;
        $categories = [];
        $cookPlace = null;
        $course = null;
        // Case 1: order menu
        if ($this->rShopMenu) {
            $menu = $this->rShopMenu->mMenu;
            $categories = $this->rShopMenu->mMenuCategory->sortByDesc('tier_number');
            if ($menu) {
                $cookPlace = $menu->menuCookPlace;
                $menuCurrentPrice = getMenuPriceHelper($menu, config('const.function_helper.menu_price.menu_type'));
                $menu->price = $menuCurrentPrice['price_unit_with_tax'];
                $menu->current_price = $menuCurrentPrice;
                $menu->m_images = MImageResource::collection($menu->mImages);
                $menu->main_image = $menu->mainImage ? new MImageResource($menu->mainImage) : null;
                $menu->main_image_path = $menu->mainImage ? $menu->mainImage->image_path : null;
            }
        } else if ($this->rShopCourse) {
            // Case 2: Order course
            $course = $this->rShopCourse->mCourse;
        }

        $hashId = $menu ? $menu->hash_id : ($course ? $course->hash_id : null);
        $name = $menu ? $menu->name : ($course ? $course->name : $this->menu_name);
        if ($this->order_type === TOrder::SERVICE_FEE_TYPE_VALUE) {
            $name = 'Phí dịch vụ';
        } elseif ($this->order_type === config('const.COURSE_TYPE.ORDER_WITHOUT_MENU')) {
            $name = $this->menu_name;
        }

        return [
            'id' => $this->id,
            'status' => $this->status,
            'quantity' => $this->quantity,
            'ordered_at' => \Carbon\Carbon::parse($this->ordered_at)->format('Y/m/d H:i:s'),
            'updated_at' => \Carbon\Carbon::parse($this->updated_at)->format('Y/m/d H:i'),
            'categories' => $categories && count($categories) ? CategoryResource::collection($categories) : null,
            'hash_id' => $hashId,
            'name' => $name,
            'price' => $orderCurrentPrice['price_unit_with_tax'],
            'price_unit' => $orderCurrentPrice['price_unit_with_tax'],
            'current_price' => $orderCurrentPrice,
            'm_menu' => $menu,
            'amount' => $this->amount,
            'order_type' => $this->order_type,
            'm_course' => $course ? new CourseResource($course) : null,
            'm_shop_cook_place' => $cookPlace,
            'm_staffs' => $this->mStaffs,
            'is_first_order' => $this->is_first_order ?? null,
            'tax_value' => $this->tax_value,
            'tax_rate' => $this->tax_rate,
        ];
    }

    public function with($request): array
    {
        return [
            'status' => 'success',
            'message' => '',
        ];
    }
}
