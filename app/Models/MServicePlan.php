<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MServicePlan extends Model
{
    use SoftDeletes;

    protected $table = 'm_service_plan';

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    public function rServicePlanConditions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RServicePlanCondition::class);
    }

    public function tServiceBillingDetails(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(TServiceBillingDetail::class, 'service', 'service_type', 'service_id');
    }

    public function rFunctionConditions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(RFunctionCondition::class, RServicePlanCondition::class);
    }

    public function mFunctions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(MFunction::class, MServicePlanOption::class);
    }
}
