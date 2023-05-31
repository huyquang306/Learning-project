<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MCurrency extends Model
{
    use HasFactory;

    protected $table = 'm_currency';
    protected $fillable = [
        'code',
        'name',
        'm_country_id',
    ];
}
