<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MShopMeta extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'm_shop_meta';
    protected $fillable = [
        'm_shop_id',
        'type',
        'value',
    ];

    const SNS_LINK_TYPE = 'sns_link_type';
    const INSTAGRAM_LINK_TYPE = 'instagram_link_type';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mShop(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(MShop::class, 'm_shop_id', 'id');
    }
}
