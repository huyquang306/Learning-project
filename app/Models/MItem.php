<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_item';
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
          'r_shop_item',
          'm_item_id',
          'm_shop_id'
        )->wherePivot('deleted_at', '=', null);
    }

    /**
     * Relationship with MCategory
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mCategories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
          MCategory::class,
          'm_item_category',
          'm_item_id',
          'm_category_id'
        )->wherePivot('deleted_at', '=', null);
    }
}
