<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RShopCourse extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'r_shop_course';
    protected $fillable = ['m_shop_id', 'm_course_id'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mCourse(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MCourse::class, 'm_course_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mCoursePrices(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MCoursePrice::class, 'r_shop_course_id', 'id');
    }
}
