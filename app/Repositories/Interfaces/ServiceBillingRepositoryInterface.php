<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;
use App\Models\TServiceBilling;

interface ServiceBillingRepositoryInterface extends BaseRepositoryInterface
{
    public function getShopBillingsPagination(MShop $shop);

    public function getBillingById(string $stripeId);

    public function updateServiceBilling(TServiceBilling $serviceBilling, array $data);

    public function createMonthlyServiceBilling($data);
}