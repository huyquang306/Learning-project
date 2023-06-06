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
            'r_shop_genre',
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
            'r_shop_item',
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

    /**
     * Relationship with MTable (include deleted Table)
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mTablesWithTrashed(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MTable::class, 'm_shop_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tOrderGroups(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TOrderGroup::class, 'm_shop_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function tOrderGroupsInLastMonth(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        $firstDayInLastMonth = now()->subMonth()->startOfMonth();
        $lastDayInLastMonth = now()->subMonth()->lastOfMonth();

        return $this->hasMany(TOrderGroup::class, 'm_shop_id', 'id')
            ->whereDate('created_at', '>=', $firstDayInLastMonth)
            ->whereDate('created_at', '<=', $lastDayInLastMonth);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mCourses(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MCourse::class,
            'r_shop_course',
            'm_shop_id',
            'm_course_id'
        )->wherePivot('deleted_at', null);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mCountry(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MCountry::class, 'm_country_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function mShopPosSetting(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(MShopPosSetting::class, 'm_shop_id', 'id');
    }
}
