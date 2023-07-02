<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RShopStaff extends Model
{
    use HasFactory;

    const IS_STAFF_PAY = 1;

    protected $table = 'r_shop_staff';
}
