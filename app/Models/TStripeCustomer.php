<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TStripeCustomer extends Model
{
    use SoftDeletes;

    protected $table = 't_stripe_customer';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    const STAFF_TYPE = 'App\Models\MStaff';
    const USER_TYPE = 'App\Models\MUser';
    const STAFF_TYPE_IN_PARAM = 'staff';
    const USER_TYPE_IN_PARAM = 'user';

    const CARD_PAYMENT_METHOD = 1;
    const INVOICE_PAYMENT_METHOD = 2;

    public function customer()
    {
        return $this->morphTo(__FUNCTION__, 'customer_type', 'customer_id');
    }
}
