<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $qr_code = \QrCode::size(config('const.QR_CODE_SIZE'))->generate($this->hash_id);
        $smart_order_url = env('SMART_ORDER_APP_URL', '');

        $tables = TableResource::collection($this->mTables()->orderBy('code', 'asc')->get());
        $code_tables = [];
        if (count($tables) > 0) {
            foreach ($tables as $key => $table) {
                $code_tables[] = $table->code;
            }
        }
        $code_tables = implode(',', $code_tables);

        if (isset($this->base_customer_url)) {
            $customer_url = $smart_order_url . $this->base_customer_url . '&table_code=' . urlencode($code_tables);
            $qr_code = \QrCode::size(config('const.QR_CODE_SIZE'))->generate($customer_url);
        }

        $orders = $this->tOrders ?? [];
        $orders = $orders ? HistorySummaryOrderResource::collection($orders) : null;

        return [
            'id' => $this->id,
            'hash_id' => $this->hash_id,
            'status' => $this->status,
            'order_blocked' => $this->order_blocked,
            'number_of_customers' => $this->number_of_customers,
            'tables' => $this->mTables,
            'qr_code' => base64_encode($qr_code),
            'code_tables' => $code_tables,
            'smart_order_url' => $smart_order_url,
            'orders' => $orders,
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
