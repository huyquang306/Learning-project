<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;
use Illuminate\Database\Eloquent\Collection;

interface ShopCookPlaceRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get list of a shop
     * @param MShop $shop
     *
     * @return Collection|null
     */
    public function getListOfShop(MShop $shop): ?Collection;
}