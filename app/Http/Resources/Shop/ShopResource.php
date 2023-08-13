<?php

namespace App\Http\Resources\Shop;

use App\Models\MShopMeta;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $staffCanPay = $this->mStaffsCanPay->first();
        $currentServicePlan = $this->mServicePlans ? $this->mServicePlans->filter(
            function ($item) {
                return ($item->pivot->end_date === null && $item->pivot->applied_date <= now())
                    || $item->pivot->end_date == now()->endOfMonth();
            }
        )->first() : null;

        return [
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'postal_code' => $this->postal_code,
            'prefecture' => $this->prefecture,
            'city' => $this->city,
            'address' => $this->address,
            'building' => $this->building,
            'phone_number' => $this->phone_number,
            'fax_number' => $this->fax_number,
            'email' => $this->email,
            'lat' => $this->lat,
            'lon' => $this->lon,
            'opened' => $this->opened,
            'open_date' => $this->open_date,
            'close_date' => $this->close_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'items' => $this->items,
            'genres' => $this->genres,
            'm_business_hours' => $this->mBusinessHours,
            'm_shop_metas' => $this->mShopMetas,
            'sns_links' => $this->getShopMetaByKey($this, MShopMeta::SNS_LINK_TYPE),
            'service_plan' => new ServicePlanResource($currentServicePlan),
            'payment_method' => $staffCanPay && $staffCanPay->tStripeCustomer
                ? $staffCanPay->tStripeCustomer->payment_method
                : null,
            'usageQRCodeInMonth' => $this->tOrderGroups ? count($this->tOrderGroups) : 0,
            'instagram_link' => $this->getShopMetaByKey($this, MShopMeta::INSTAGRAM_LINK_TYPE),
            'mShopPosSetting' => $this->mShopPosSetting,
            'm_country' => $this->mCountry,
            'is_active' => $this->is_active,
            'billings_in_month' => $this->tServiceBillings,
        ];
    }

    public function getShopMetaByKey($shop, $type)
    {
        $record = $shop->mShopMetas->where('type', $type)->first();

        return $record ? json_decode($record->value) : null;
    }
}
