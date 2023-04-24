<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MTable extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_table';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
    protected $hidden = ['created_at', 'updated_at', 'deleted_at','modified_by'];

    const STATUS_TRUE = true;

    /**
     * Route key name
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
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function mShops(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->belongsTo(
            MShop::class,
            'm_shop_id',
            'id'
        )->where('deleted_at', null);
    }
}
