<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;

interface StaffRepositoryInterface extends BaseRepositoryInterface
{
    public function getSAccountByFireBaseUid(string $uid);

    /**
     * Get list staffs of a shop
     * @param MShop $shop
     *
     * @return mixed
     */
    public function getListOfShop(MShop $shop);
}
