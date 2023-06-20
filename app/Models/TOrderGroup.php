<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TOrderGroup extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 't_ordergroup';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at', 'published_at'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at','modified_by', 'published_at'];

    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mTables(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MTable::class,
            'r_table_ordergroup',
            't_ordergroup_id',
            'm_table_id'
        )->wherePivot('deleted_at', null);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tOrders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TOrder::class, 't_ordergroup_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mShop(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MShop::class, 'm_shop_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function tPayment(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(TPayment::class, 't_ordergroup_id', 'id');
    }
}
