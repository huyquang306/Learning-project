<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TServiceBilling extends Model
{
    protected $table = 't_service_billing';
    protected $guarded = ['id', 'created_at', 'updated_at'];

    const SHOP_SERVICE_PAYMENT_TYPE = 0;

    const OPEN_STATUS = 0;
    const SUCCESS_STATUS = 1;
    const FAILED_STATUS = 2;
    const UNFIXED_STATUS = 3;

    const SERVICE_PLAN_SERVICE_TYPE = 'App\Models\MServicePlan';

    const SHOP_BUYER_TYPE = 'App\Models\MStaff';

    const CARD_PAYMENT_METHOD = 1;
    const INVOICE_PAYMENT_METHOD = 2;

    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    public function mShop(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MShop::class);
    }

    public function mUser(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MUser::class);
    }

    public function tServiceBillingDetails(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TServiceBillingDetail::class, 't_service_billing_id', 'id');
    }

    public function buyer()
    {
        return $this->morphTo(__FUNCTION__, 'buyer_type', 'buyer_id');
    }
}
