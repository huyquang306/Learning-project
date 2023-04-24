<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SConfiguration extends Model
{
    use HasFactory;

    protected $table = 's_configuration';
    protected $guarded = ['id', 'created_at', 'updated_at'];

    const ROBOT_REGISTER_KEY = 'ROBOT_REGISTER';
    const ROBOT_REGISTER_FALSE = 0;
    const ROBOT_REGISTER_TRUE = 1;
}
