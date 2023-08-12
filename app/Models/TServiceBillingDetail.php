<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TServiceBillingDetail extends Model
{
    protected $table = 't_service_billing_detail';

    protected $guarded = ['id', 'created_at', 'updated_at'];

    const PLAN_FEE_TYPE = 1;
    const INITIAL_PLAN_FEE_TYPE = 2;
    const EXTEND_QR_PLAN_FEE_TYPE = 3;

    public function getRouteKeyName()
    {
        return 'hash_id';
    }

    public function tServiceBilling()
    {
        return $this->belongsTo(TServiceBilling::class, 't_service_billing_id', 'id');
    }

    public function service()
    {
        return $this->morphTo();
    }
}
