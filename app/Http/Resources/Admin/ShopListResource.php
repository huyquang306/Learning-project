<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Admin\ServicePlanResource;
use App\Models\TServiceBilling;
use App\Models\TServiceBillingDetail;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ShopListResource extends ResourceCollection
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
            'data' => $this->collection->transform(function ($item) {
                return [
                    'hash_id' => $item->hash_id,
                    'name' => $item->name,
                    'postal_code' => $item->postal_code,
                    'prefecture' => $item->prefecture,
                    'city' => $item->city,
                    'address' => $item->address,
                    'building' => $item->building,
                    'phone_number' => $item->phone_number,
                    'fax_number' => $item->fax_number,
                    'email' => $item->email,
                    'lat' => $item->lat,
                    'lon' => $item->lon,
                    'opened' => $item->opened,
                    'open_date' => $item->open_date,
                    'close_date' => $item->close_date,
                    'view_kind' => $item->view_kind,
                    'lunch_start_time' => $item->lunch_start_time,
                    'lunch_end_time' => $item->lunch_end_time,
                    'start_time' => $item->start_time,
                    'end_time' => $item->end_time,
                    'wifi_name' => $item->wifi_name,
                    'wifi_pass' => $item->wifi_pass,
                    'created_at' => $item->created_at,
                    'is_active' => $item->is_active,
                    'contract_cancel_date' => $item->contract_cancel_date,
                    'payment_method' => count($item->mStaffsCanPay) && $item->mStaffsCanPay[0]->tStripeCustomer
                        ? $item->mStaffsCanPay[0]->tStripeCustomer->payment_method
                        : null,
                    'usageQRCodeInMonth' => $item->t_order_groups_count ?? 0,
                    'billing_is_payment' => $this->checkShopDoesPayment($item->tServiceBillings),
                    'service_plan' => count($item->mServicePlans)
                        ? new ServicePlanResource($item->mServicePlans->first())
                        : null,
                    'billings_in_month' => $this->getBillingsInMonth(
                        $item->tServiceBillings ?: []
                    ),
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

    public function checkShopDoesPayment($tServiceBillings)
    {
        // Have not any service billings
        if (count($tServiceBillings) <= 0) {
            return null;
        }
        $isBillingDoesntPayment = $tServiceBillings->filter(function ($billing) {
            return $billing->status !== TServiceBilling::SUCCESS_STATUS;
        })->first();

        return !$isBillingDoesntPayment;
    }

    public function getBillingsInMonth($tServiceBillings)
    {
        return $tServiceBillings->map(function ($billing) {
            $servicePlanBilling = $billing->tServiceBillingDetails
                ? $billing->tServiceBillingDetails->first(function ($tServiceDetail) {
                    return $tServiceDetail->fee_type === TServiceBillingDetail::PLAN_FEE_TYPE;
                }) : null;
            $billing->service = $servicePlanBilling ? new ServicePlanResource($servicePlanBilling->service) : null;

            return $billing;
        });
    }
}
