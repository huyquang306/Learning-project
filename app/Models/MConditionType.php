<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MConditionType extends Model
{
    use SoftDeletes;

    protected $table = 'm_condition_type';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    const TYPE_USABLE = 'is_usable';
    const TYPE_MAX_VALUE = 'max_value_of_use';

    public function rFunctionConditions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RFunctionCondition::class, 'm_condition_type_id', 'id');
    }
}
