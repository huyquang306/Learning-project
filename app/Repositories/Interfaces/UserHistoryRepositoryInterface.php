<?php

namespace App\Repositories\Interfaces;

use App\Repositories\Interfaces\BaseRepositoryInterface;

interface UserHistoryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get list of Users
     *
     * @param MShop $shop
     * @param array $dataFilter
     *
     * @return \Illuminate\Support\Collection
     */
    public function getList($shop, $dataFilter);

    /**
     * Show detal user history
     *
     * @param array $dataFilter
     * @param MShop $shop
     * @param MUser $user
     * @return \Illuminate\Support\Collection
     */
    public function showDetail($dataFilter, $shop, $user);
}
