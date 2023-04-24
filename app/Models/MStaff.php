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
          'm_shop_staff',
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
}
