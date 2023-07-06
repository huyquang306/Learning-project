<?php

namespace App\Http\Resources\Admin;

use App\Models\TServiceBilling;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'postal_code' => $this->postal_code,
            'prefecture' => $this->prefecture,
            'city' => $this->city,
            'address' => $this->address,
            'building' => $this->building,
            'phone_number' => $this->phone_number,
            'city_kana' => $this->city_kana,
            'address_kana' => $this->address_kana,
            'fax_number' => $this->fax_number,
            'email' => $this->email,
            'lat' => $this->lat,
            'lon' => $this->lon,
            'opened' => $this->opened,
            'open_date' => $this->open_date,
            'close_date' => $this->close_date,
            'view_kind' => $this->view_kind,
            'lunch_start_time' => $this->lunch_start_time,
            'lunch_end_time' => $this->lunch_end_time,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'wifi_name' => $this->wifi_name,
            'wifi_pass' => $this->wifi_pass,
            'created_at' => $this->created_at,
            'is_active' => $this->is_active,
            'contract_cancel_date' => $this->contract_cancel_date,
            'payment_method' => count($this->mStaffsCanPay) && $this->mStaffsCanPay[0]->tStripeCustomer
                ? $this->mStaffsCanPay[0]->tStripeCustomer->payment_method
                : null,
            'usageQRCodeInMonth' => $this->tOrderGroups->count(),
            'billing_is_payment' => $this->checkShopDoesPayment($this->tServiceBillings),
            'service_plan' => count($this->mServicePlans) ? $this->mServicePlans->first() : null,
            'total_orders_number' => $this->getTOrderTotal($this->tOrderGroups),
            'total_customer_payment' => $this->getCustomerPaymentTotal($this->tOrderGroups),
            'last_month' => [
                'usageQRCodeInMonth' => count($this->tOrderGroupsInLastMonth),
                'total_orders_number' => $this->getTOrderTotal($this->tOrderGroupsInLastMonth),
                'total_customer_payment' => $this->getCustomerPaymentTotal($this->tOrderGroupsInLastMonth),
            ],
            'billings_in_month' => $this->tServiceBillings,
        ];
    }

    protected function checkShopDoesPayment($tServiceBillings)
    {
        if (count($tServiceBillings) <= 0) {
            return null;
        }
        $billingDoesntPayment = $tServiceBillings->filter(function ($billing) {
            return $billing->status === TServiceBilling::OPEN_STATUS;
        })->first();

        return !$billingDoesntPayment;
    }

    protected function getTOrderTotal($orderGroups)
    {
        $result = 0;
        foreach ($orderGroups as $orderGroup) {
            $result += count($orderGroup->tOrders);
        }

        return $result;
    }

    protected function getCustomerPaymentTotal($orderGroups)
    {
        $result = 0;
        foreach ($orderGroups as $orderGroup) {
            $result += $orderGroup->total_billing;
        }

        return $result;
    }
}
