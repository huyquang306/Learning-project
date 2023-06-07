<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TShopAnnouncement extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 't_shop_announcement';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

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
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mShopBusinessHours(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MShopBusinessHour::class, 't_shop_announcement_id', 'id');
    }
}
