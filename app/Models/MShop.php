<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MShop extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_shop';
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

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
     * Relationship with MGenre
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mGenres(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MGenre::class,
            'm_shop_genre',
            'm_shop_id',
            'm_genre_id'
        )->wherePivot('deleted_at', '=', null);
    }

    /**
     * Relationship with MItem
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mItems(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MItem::class,
            'm_shop_item',
            'm_shop_id',
            'm_item_id'
        )->wherePivot('deleted_at', '=', null);
    }

    /**
     * Relationship with MStaff
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mStaffs(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MStaff::class,
            'r_shop_staff',
            'm_shop_id',
            'm_staff_id'
        )->wherePivot('deleted_at', '=', null);
    }

    /**
     * Relationship with MTable
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mTables(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(
            MTable::class,
            'm_shop_id',
            'id',
        )->where('deleted_at', null);
    }
}
