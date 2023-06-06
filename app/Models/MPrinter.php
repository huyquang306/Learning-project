<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MPrinter extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_printer';

    const STATUS_DISABLE = 0;
    const STATUS_ENABLE = 1;

    public $fillable = [
        'm_shop_id',
        'hash_id',
        'name',
        'status',
        'model',
        'address',
        'ip',
        'position',
        'm_printer_status_id',
    ];

    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }
}
