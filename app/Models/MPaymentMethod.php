<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MPaymentMethod extends Model
{
    use HasFactory;

    protected $table = 'm_payment_method';
    protected $fillable = [
        'm_country_id',
        'name',
    ];

    const CASH_NAME = 'Tiền mặt';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mShops(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MShop::class,
            RShopPaymentMethod::class,
            'm_shop_id',
            'm_payment_method_id'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mCountry(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MCountry::class, 'm_country_id', 'id');
    }
}
