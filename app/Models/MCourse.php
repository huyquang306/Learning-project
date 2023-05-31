<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MCourse extends Model
{
    use HasFactory, SoftDeletes;

    const ACTIVE_STATUS = 'active';
    const INACTIVE_STATUS = 'inactive';
    const INITIAL_PROPOSE_FLG_OFF = 0;
    const INITIAL_PROPOSE_FLG_ON = 1;

    protected $table = 'm_course';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];

    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function rShopCourse(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(RShopCourse::class, 'm_course_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function childCourses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MCourse::class, 'parent_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mShops(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MShop::class,
            'r_shop_course',
            'm_course_id',
            'm_shop_id'
        )->wherePivot('deleted_at', null);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mMenus(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MMenu::class,
            'r_course_menu',
            'm_course_id',
            'm_menu_id'
        )->wherePivot('deleted_at', null)
            ->withPivot([
                'status',
            ]);
    }
}
