<?php

namespace App\Services\Admin;

use App\Models\MShop;
use App\Repositories\Interfaces\ServiceBillingRepositoryInterface as ServiceBillingRepository;

class TServiceBillingService
{
    protected $serviceBillingRepository;

    /**
     * TServiceBillingService constructor.
     * @param ServiceBillingRepository $serviceBillingRepository
     */
    public function __construct(ServiceBillingRepository $serviceBillingRepository)
    {
        $this->serviceBillingRepository = $serviceBillingRepository;
    }

    /**
     * Get shop billings
     *
     * @return mixed
     */
    public function getShopBillingsPagination(MShop $shop)
    {
        return $this->serviceBillingRepository->getShopBillingsPagination($shop);
    }
}