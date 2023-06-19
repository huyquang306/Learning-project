<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $name = '';
        if ($this->order_type === config('const.ORDER_TYPE.ORDER_WITHOUT_MENU')) {
            $name = $this->menu_name;
        } elseif ($this->rShopMenu && $this->rShopMenu->mMenu) {
            $name = $this->rShopMenu->mMenu->name;
        }

        return [
            'id' => $this->id,
            't_ordergroup_id' => $this->t_ordergroup_id,
            'r_shop_menu_id' => $this->r_shop_menu_id,
            'status' => $this->status,
            'name' => $name,
            'quantity' => $this->quantity,
            'ordered_at' => $this->ordered_at,
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
