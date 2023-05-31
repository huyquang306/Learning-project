<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MShopBusinessHour extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_shop_business_hour';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    const OVERDAY_FLAG_ON = 1;
    const OVERDAY_FLAG_OFF = 0;

    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mShop(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MShop::class, 'm_shop_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tShopAnnouncement(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(TShopAnnouncement::class, 't_shop_announcement_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mShopBusinessHourPrices(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MShopBusinessHourPrice::class, 'm_shop_business_hour_id', 'id');
    }
}
