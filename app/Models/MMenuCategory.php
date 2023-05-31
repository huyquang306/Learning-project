<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MMenuCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_menu_category';
    public $fillable = ['m_shop_id', 'code', 'name', 'short_name', 'parent_id', 'tier_number'];

    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function childCategories(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MMenuCategory::class, 'parent_id', 'id');
    }
}
