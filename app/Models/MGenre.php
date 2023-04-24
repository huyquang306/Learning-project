<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MGenre extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_genre';
    protected $hidden = ['id', 'created_at', 'updated_at', 'deleted_at', 'modified_by'];

    /**
     * Relationship with MShop
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function mShops(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            MShop::class,
            'r_shop_genre',
            'm_genre_id',
            'm_shop_id'
        )->wherePivot('deleted_at', '=', null);
    }
}
