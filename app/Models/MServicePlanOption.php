<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MServicePlanOption extends Model
{
    protected $table = 'm_service_plan_option';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function mFunction(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MFunction::class, 'm_function_id', 'id');
    }

    public function mServicePlan(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MServicePlan::class, 'm_service_plan_id', 'id');
    }
}
