<?php

namespace App\Http\Resources\User;

use App\Http\Resources\Shop\TableResource;
use Illuminate\Http\Resources\Json\JsonResource;

class BillingOrdergroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $orders = $this->tOrders()
            ->with([
                'rShopMenu.mMenu',
                'rShopCourse.mCourse',
            ])
            ->get();
        $listMenuInCourse = [];
        foreach ($orders as &$order) {
            if ($order->rShopCourse) {
                $listMenuInCourse = $order->rShopCourse->mCourse->mMenus->pluck('id')->toArray();
            }
        }
        foreach ($orders as &$order) {
            $order->isMenuInSourse = false;
            if ($order->rShopMenu && count($listMenuInCourse)) {
                $menuId = $order->rShopMenu->mMenu->id;
                $order->isMenuInSourse = in_array($menuId, $listMenuInCourse);
            }
        }
        $orders = BillingOrderResource::collection($orders);
        $tables = TableResource::collection($this->mTables()->orderBy('code', 'asc')->get());
        $code_tables = [];
        if (count($tables) > 0) {
            foreach ($tables as $key => $table) {
                $code_tables[] = $table->code;
            }
        }

        return [
            'hash_id' => $this->hash_id,
            'm_shop_id' => $this->m_shop_id,
            'status' => $this->status,
            'order_blocked' => $this->order_blocked,
            'number_of_customers' => $this->number_of_customers,
            'total_item' => count($this->tOrders),
            'total_amount' => $orders->collection->sum('amount'),
            'total_billing' => $this->total_billing,
            'published_at' => $this->published_at,
            'code_tables' => implode(',', $code_tables),
            'orders' => $orders,
            'tables' => $tables,
            'm_course_id' => $this->m_course_id,
            'm_time_block_id' => $this->m_time_block_id,
            'extend_course_flag' => $this->extend_course_flag,
        ];
    }
}
