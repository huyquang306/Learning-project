<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MTax extends Model
{
    use HasFactory;

    protected $table = 'm_tax';
    protected $fillable = ['m_country_id', 'name', 'tax_rate'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function mMenus(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(MMenu::class, 'm_tax_id', 'id');
    }
}
