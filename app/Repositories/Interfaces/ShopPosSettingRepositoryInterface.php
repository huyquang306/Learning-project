<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;
use App\Models\MShopPosSetting;
use Illuminate\Support\Collection;

interface ShopPosSettingRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get shop tax info
     *
     * @param MShop $shop
     * @return MShopPosSetting|null
     */
    public function getTaxInfo(MShop $shop): ?MShopPosSetting;

    /**
     * Update shop tax info
     * @param MShop $shop
     * @param array $taxInfo
     *
     * @return MShopPosSetting|null
     */
    public function updateShopTax(MShop $shop, array $taxInfo): ?MShopPosSetting;

    /**
     * Get shop tax options
     * @param MShop $shop
     *
     * @return Collection
     */
    public function getTaxOptions(MShop $shop): Collection;
}
