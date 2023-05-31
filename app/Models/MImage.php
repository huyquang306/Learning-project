<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_image';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
}
