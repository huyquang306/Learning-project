<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TPaymentMethod extends Model
{
    protected $table = 't_payment_method';
    protected $guarded = ['id', 'created_at', 'updated_at'];
    protected $hidden = ['id', 'created_at', 'updated_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tPayment(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(TPayment::class, 't_payment_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function mPaymentMethod(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(MPaymentMethod::class, 'id', 'm_payment_method_id');
    }
}
