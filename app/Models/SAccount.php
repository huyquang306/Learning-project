<?php

namespace App\Models;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SAccount extends Model implements Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $table = 's_account';
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];

    /**
     * Relationship with MStaff
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mStaff(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(
            MStaff::class,
            'm_staff_id',
            'id'
        );
    }

    /**
     * @return mixed
     */
    public function getAuthIdentifier()
    {
        return $this['firebase_uid'];
    }

    /**
     * @return string
     */
    public function getAuthIdentifierName(): string
    {
        return 'firebase_uid';
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
}
