<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MPosition extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_position';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];
}
