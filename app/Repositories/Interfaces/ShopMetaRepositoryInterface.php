<?php

namespace App\Repositories\Interfaces;

use Illuminate\Support\Collection;

interface ShopMetaRepositoryInterface
{
    /**
     * Get value by type, shop
     *
     * @param integer $shopId
     * @param $type
     * @return \Illuminate\Support\Collection
     */
    public function getShopMetaByKey($shopId, $type);

    /**
     * Update Value by type, shop
     *
     * @param integer $shopId
     * @param string  $type
     * @param object  $data
     *
     * @return \Illuminate\Support\Collection
     */
    public function updateShopMetaByKey($shopId, $type, $data);
}
