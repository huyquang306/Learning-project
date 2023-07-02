<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RFunctionCondition extends Model
{
    protected $table = 'r_function_condition';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function mFunction(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MFunction::class, 'm_function_id', 'id');
    }

    public function mConditionType(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MConditionType::class, 'm_condition_type_id', 'id');
    }

    public function rServicePlanConditions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RServicePlanCondition::class, 'r_function_condition_id', 'id');
    }

    public function mServicePlans(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(MServicePlan::class, RServicePlanCondition::class);
    }
}
