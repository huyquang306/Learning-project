<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MStaff extends Model
{
    use HasFactory;

    protected $table = 'm_staff';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];

    /**
     * Get the route key for the model
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    /**
     * Relationship with MShop
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mShops(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
          MShop::class,
          'r_shop_staff',
          'm_staff_id',
          'm_shop_id'
        )->wherePivot('deleted_at', '=', null);
    }

    /**
     * Relationship with SAccount
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function sAccount(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(
            SAccount::class,
            'm_staff_id',
            'id'
        );
    }

    public function tOrders(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            TOrder::class,
            'r_order_staff',
            't_order_id',
            'm_staff_id'
        );
    }

    public function tServiceBillings(): \Illuminate\Database\Eloquent\Relations\MorphOne
    {
        return $this->morphOne(TServiceBilling::class, 'buyer');
    }

    public function tStripeCustomer(): \Illuminate\Database\Eloquent\Relations\MorphOne
    {
        return $this->morphOne(TStripeCustomer::class, 'customer');
    }
}
