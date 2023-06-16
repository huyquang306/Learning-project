<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;

interface BusinessHourRepositoryInterface
{
    /**
     * Get list by shopId
     *
     * @param int $shopId
     * @return \Illuminate\Support\Collection
     */
    public function getListByShopId(int $shopId): \Illuminate\Support\Collection;

    /**
     * Update Business hours of shop
     *
     * @param  array $businessHours
     * @param  MShop $mShop
     * @return mixed
     */
    public function updateBusinesses(array $businessHours, MShop $mShop);
}
