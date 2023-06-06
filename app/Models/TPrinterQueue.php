<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPrinterQueue extends Model
{
    use HasFactory;

    protected $table = 't_printer_queue';

    public $fillable = [
        'status',
    ];
}
