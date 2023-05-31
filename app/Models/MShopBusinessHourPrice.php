<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MShopBusinessHourPrice extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_shop_business_hour_price';
    protected $fillable = [
        'r_shop_menu_id',
        'm_shop_business_hour_id',
        'price',
        'tax_value',
        'display_flg',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mShop(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MShop::class, 'm_shop_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOneThrough
     */
    public function mMenu(): \Illuminate\Database\Eloquent\Relations\HasOneThrough
    {
        return $this->hasOneThrough(
            MMenu::class,
            RShopMenu::class,
            'm_menu_id',
            'r_shop_menu_id'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mShopBusinessHour(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MShopBusinessHour::class, 'm_shop_business_hour_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rShopMenu(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(RShopMenu::class, 'r_shop_menu_id', 'id');
    }
}
