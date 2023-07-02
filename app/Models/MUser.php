<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MUser extends Model implements Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_user';
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];

    /**
     * Get the route key for the model
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'hash_id';
    }

    /**
     * @return string
     */
    public function getAuthIdentifierName(): string
    {
        return 'firebase_uid';
    }

    /**
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this['firebase_uid'];
    }


    /**
     * @throws \Exception
     */
    public function getAuthPassword()
    {
        throw new \Exception('Not available');
    }

    /**
     * @throws \Exception
     */
    public function getRememberToken()
    {
        throw new \Exception('Not available');
    }

    /**
     * @throws \Exception
     */
    public function setRememberToken($value)
    {
        throw new \Exception('Not available');
    }

    /**
     * @throws \Exception
     */
    public function getRememberTokenName()
    {
        throw new \Exception('Not available');
    }

    public function tOrders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TOrder::class, 'm_user_id', 'id');
    }

    public function tServiceBillings(): \Illuminate\Database\Eloquent\Relations\MorphOne
    {
        return $this->morphOne(TServiceBilling::class, 'buyer');
    }

    public function tStripeCustomer(): \Illuminate\Database\Eloquent\Relations\MorphOne
    {
        return $this->morphOne(TStripeCustomer::class, 'customer');
    }
}
