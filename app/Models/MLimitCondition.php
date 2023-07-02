<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MLimitCondition extends Model
{
    use SoftDeletes;

    protected $table = 'm_limit_condition';

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
}
