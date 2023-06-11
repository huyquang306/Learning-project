<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\MShopCookPlace;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Interfaces\ShopCookPlaceRepositoryInterface;

class ShopCookPlaceRepository extends BaseRepository implements ShopCookPlaceRepositoryInterface
{

    public function getModel(): string
    {
        return MShopCookPlace::class;
    }

    /**
     * Get list of a shop
     * @param MShop $mShop
     *
     * @return Collection|null
     */
    public function getListOfShop(MShop $shop): ?Collection
    {
        return $this->model->where('m_shop_id', $shop->id)->get();
    }
}
