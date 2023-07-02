<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RShopServicePlan extends Model
{
    use SoftDeletes;

    protected $table = 'r_shop_service_plan';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    const ACTIVE_STATUS = 1;
    const CANCEL_STATUS = 0;

    public function mShop(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MShop::class);
    }

    public function mServicePlan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MServicePlan::class);
    }
}
