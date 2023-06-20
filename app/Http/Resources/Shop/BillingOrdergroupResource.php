<?php

namespace App\Http\Resources\Shop;

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
        $orders = BillingOrderResource::collection($this->tOrders);

        return [
            'hash_id' => $this->hash_id,
            'm_shop_id' => $this->m_shop_id,
            'status' => $this->status,
            'order_blocked' => $this->order_blocked,
            'number_of_customers' => $this->number_of_customers,
            'total_item' => count($this->tOrders),
            'total_amount' => $orders->collection->sum('amount'),
            'orders' => $orders,
            't_payment' => $this->tPayment,
        ];
    }
}
