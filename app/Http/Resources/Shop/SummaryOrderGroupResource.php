<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class SummaryOrderGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $orders = $this->tOrders;
        foreach ($orders as &$order) {
            $order->shop_id = $this->m_shop_id;
        }
        $orders = HistorySummaryOrderResource::collection($orders);
        $tables = TableResource::collection($this->mTables);
        $code_tables = [];
        if (count($this->mTables) > 0) {
            foreach ($this->mTables as $table) {
                array_push($code_tables, $table->code);
            }
        }

        return [
            'id' => $this->id,
            'hash_id' => $this->hash_id,
            'status' => $this->status,
            'order_blocked' => $this->order_blocked,
            'number_of_customers' => $this->number_of_customers,
            'published_at' => $this->published_at,
            'created_at' => getDateTime(strtotime($this->created_at)),
            'created_at_utc' => $this->created_at,
            'code_tables' => implode(', ', $code_tables),
            'orders' => $orders,
            'tables' => $tables,
            'invoice_code' => makeInvoiceCode($this->created_at, $this->id),
            'total_billing' => $this->total_billing,
            'file_path' => $this->file_path,
        ];
    }
}
