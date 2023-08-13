<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TTmpShop extends Model
{
    use HasFactory;
    protected $table = 't_tmp_shop';
    const REGISTER_LINK_TYPE = 'register';
    const FORGOT_PASSWORD_LINK_TYPE = 'forgot-password';
    const REGISTER_SHOP_TYPE = 0;
    const FORGOT_PASSWORD_TYPE = 1;
    const COPY_DEACTIVATE_SHOP_TYPE = 2;

    public $fillable = [
        'hash_id',
        'email',
        'type',
        'shop_info',
        'expired_time',
    ];
}
