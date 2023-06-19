<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 't_order';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];

    const ADD_ORDER_TYPE = 'add';
    const UPDATE_ORDER_TYPE = 'update';
    const CANCEL_ORDER_TYPE = 'cancel';

    // type of order
    const MENU_ORDER_TYPE_VALUE = 0;
    const COURSE_ORDER_TYPE_VALUE = 1;
    const COURSE_EXTEND_ORDER_TYPE_VALUE = 2;
    const SERVICE_FEE_TYPE_VALUE = 3;
    const ORDER_WITHOUT_MENU_TYPE_VALUE = 4;

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function rShopMenu(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(RShopMenu::class, 'r_shop_menu_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tOrderGroup(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(TOrderGroup::class, 't_ordergroup_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mStaffs(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MStaff::class,
            'r_order_staff',
            't_order_id',
            'm_staff_id'
        );
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function rShopCourse(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne('App\Models\RShopCourse', 'id', 'r_shop_course_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mUser(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MUser::class, 'm_user_id', 'id');
    }
}
