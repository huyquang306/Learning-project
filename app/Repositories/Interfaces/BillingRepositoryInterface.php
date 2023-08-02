<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;

interface BillingRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Show detail billing payment history
     *
     * @param MShop $shop
     * @return \Illuminate\Support\Collection
     */
    public function getListHistories(MShop $shop);
}
