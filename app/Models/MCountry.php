<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MCountry extends Model
{
    use HasFactory;

    protected $table = 'm_country';
    protected $fillable = [
        'code',
        'name',
        'english_name',
    ];

    public function mTaxs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MTax::class, 'm_country_id', 'id');
    }
}
