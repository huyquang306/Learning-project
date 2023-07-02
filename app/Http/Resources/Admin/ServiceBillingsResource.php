<?php

namespace App\Http\Resources\Admin;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ServiceBillingsResource extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'data' => $this->collection->transform(function ($item) {
                $orderGroups = $this->getOrderGroupInMonth($item);

                return [
                    'hash_id' => $item->hash_id,
                    'buyer_id' => $item->buyer_id,
                    'buyer_type' => $item->buyer_type,
                    'm_shop_id' => $item->m_shop_id,
                    'stripe_payment_id' => $item->stripe_payment_id,
                    'stripe_invoice_pdf' => $item->stripe_invoice_pdf,
                    'stripe_hosted_invoice_url' => $item->stripe_hosted_invoice_url,
                    'price' => $item->price,
                    'payment_method' => $item->payment_method,
                    'status' => $item->status,
                    'log' => $item->log,
                    'type' => $item->type,
                    't_service_billing_details' => ServiceBillingDetailsResource::collection(
                        $item->tServiceBillingDetails
                    ),
                    'start_date' => $item->start_date,
                    'end_date' => $item->end_date,
                    'target_month' => $item->target_month,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'total_orders_number' => $this->getTOrderTotal($orderGroups),
                    'total_customer_payment' => $this->getCustomerPaymentTotal($orderGroups),
                    'total_qr_number' => $item->total_qr_number,
                    'extend_qr_number' => $item->extend_qr_number,
                ];
            }),
            'pagination' => [
                'total' => $this->total(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'last_pages' => $this->lastPage(),
            ],
        ];
    }

    public function getOrderGroupInMonth($bill)
    {
        $orderGroups = [];
        $month = Carbon::parse($bill->start_date)->month;
        if ($bill->mShop && $bill->mShop->tOrderGroups) {
            $orderGroups = $bill->mShop->tOrderGroups->filter(function ($orderGroup) use ($month) {
                return Carbon::parse($orderGroup->created_at)->month === $month;
            });
        }

        return $orderGroups;
    }

    public function getTOrderTotal($orderGroups)
    {
        $result = 0;
        foreach ($orderGroups as $orderGroup) {
            $result += count($orderGroup->tOrders);
        }

        return $result;
    }

    public function getCustomerPaymentTotal($orderGroups)
    {
        $result = 0;
        foreach ($orderGroups as $orderGroup) {
            $result += $orderGroup->total_billing;
        }

        return $result;
    }
}
