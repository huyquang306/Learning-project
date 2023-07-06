<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RServicePlanCondition extends Model
{
    use SoftDeletes;

    protected $table = 'r_service_plan_condition';
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function mServicePlan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MServicePlan::class);
    }

    public function rFunctionCondition(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(RFunctionCondition::class, 'r_function_condition_id', 'id');
    }
}
