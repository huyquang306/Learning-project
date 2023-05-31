<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RShopMenu extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'r_shop_menu';
    protected $fillable = ['m_shop_id', 'm_menu_id'];

    /**
     * Relationship with m_menu
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mMenu(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MMenu::class, 'm_menu_id', 'id');
    }

    /**
     * Relationship with m_menu_category
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mMenuCategory(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MMenuCategory::class,
            'r_menu_category',
            'r_shop_menu_id',
            'm_menu_category_id'
        );
    }

    /**
     * Relationship with m_menu_category without deleted
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MMenuCategory::class,
            'r_menu_category',
            'r_shop_menu_id',
            'm_menu_category_id'
        )->wherePivot('deleted_at', null);
    }
}
