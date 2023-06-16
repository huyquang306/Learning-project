<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MShopPosSetting extends Model
{
    use HasFactory;

    protected $table = 'm_shop_pos_setting';
    protected $fillable = [
        'm_shop_id',
        'm_currency_id',
        'm_country_id',
        'price_fraction_mode',
        'total_amount_fraction_mode',
        'price_display_mode',
        'serve_charge_rate',
        'serve_charge_in_use',
    ];

    const ROUND_DOWN_PRICE_FRACTION_MODE = 0;
    const ROUND_UP_PRICE_FRACTION_MODE = 1;
    const ROUND_PRICE_FRACTION_MODE = 2;
    const OFF_TOTAL_AMOUNT_FRACTION_MODE = 0;
    const ON_TOTAL_AMOUNT_FRACTION_MODE = 1;
    const INCLUDE_TAX_PRICE_DISPLAY_MODE = 0;
    const NOT_INCLUDE_TAX_PRICE_DISPLAY_MODE = 1;

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
    public function mCurrency(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MCurrency::class, 'm_currency_id', 'id');
    }
}
