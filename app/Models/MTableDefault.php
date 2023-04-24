<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MTableDefault extends Model
{
    use HasFactory;

    protected $table = 'm_table_default';
    protected $guarded = ['id', 'created_at', 'updated_at'];
}
