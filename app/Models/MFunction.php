<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MFunction extends Model
{
    use SoftDeletes;
    protected $table = 'm_function';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    const FUNCTION_NAME_QR = 'QR';
    const FUNCTION_NAME_PRINTER = 'Printer';

    const FUNCTION_CODE_QR = 'qr';
    const FUNCTION_CODE_PRINTER = 'printer';

    const OBJECT_TYPE_DATA = 'data';
    const OBJECT_TYPE_PAGE = 'page';

    const OBJECT_ORDERGROUP = 'ordergroup';
    const OBJECT_PRINTER = '***/printer';

    public function rFunctionConditions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RFunctionCondition::class, 'm_function_id', 'id');
    }

    public function mServicePlanOptions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MServicePlanOption::class, 'm_function_id', 'id');
    }

    public function mServicePlans(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(MServicePlan::class, MServicePlanOption::class);
    }
}
