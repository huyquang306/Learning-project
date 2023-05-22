<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RMenuImage extends Model
{
    use HasFactory;

    protected $table = 'r_menu_image';
    protected $guarded = ['id', 'created_at', 'updated_at'];
}
