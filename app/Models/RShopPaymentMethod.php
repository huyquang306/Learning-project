<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RShopPaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'r_shop_payment_method';
    protected $fillable = [
        'm_shop_id',
        'm_payment_method_id',
    ];
}
