<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MMenu extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_menu';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'modified_by'];

    const INITIAL_ORDER_MENU_FLAG_TRUE = 1;
    const INITIAL_ORDER_MENU_FLAG_FALSE = 0;
    const ON_SALE_STATUS = 'onsale';
    const OFF_SALE_STATUS = 'not_onsale';

    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    /**
     * Relationship with m_shop
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mShops(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MShop::class,
            'r_shop_menu',
            'm_menu_id',
            'm_shop_id'
        )->wherePivot('deleted_at', null);
    }

    /**
     * Relationship with r_shop_menu
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function rShopMenu(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(RShopMenu::class, 'm_menu_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mCourses(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MCourse::class,
            'r_course_menu',
            'm_menu_id',
            'm_course_id'
        )->wherePivot('deleted_at', null);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function mBusinessHourPrices(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            MShopBusinessHourPrice::class,
            RShopMenu::class,
            'm_menu_id',
            'r_shop_menu_id'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mTax(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MTax::class, 'm_tax_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mImages(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(MImage::class, RMenuImage::class, 'm_menu_id', 'm_image_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function mainImage(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(MImage::class, 'id', 'main_image_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function menuCookPlace()
    {
        return $this->belongsTo(MShopCookPlace::class, 'shop_cook_place_id', 'id');
    }
}
