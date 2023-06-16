<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Repositories\BusinessHourRepository;

class BusinessHourService
{
    protected $businessHourRepository;


    public function __construct(BusinessHourRepository $businessHourRepository)
    {
        $this->businessHourRepository = $businessHourRepository;
    }

    /**
     * Update Business hours of shop
     *
     * @param  array $businessHours
     * @param  MShop $mShop
     * @return void
     */
    public function updateBusinesses(array $businessHours, MShop $mShop)
    {
        $this->businessHourRepository->updateBusinesses($businessHours, $mShop);
    }

    /**
     * Check can remove business Hour, cannot remove business Hour that is mapping to mBusinessHourPrice
     *
     * @param  array $businessHours
     * @param  MShop $mShop
     * @return boolean
     */
    public function checkCanRemoveBusiness(array $businessHours, MShop $mShop): bool
    {
        $businessIds = collect($businessHours)->pluck('id')
            ->toArray();
        $businessIdsInDB = $this->businessHourRepository->getListByShopId($mShop->id)
            ->pluck('id')
            ->toArray();
        $removeBusinessIds = array_diff($businessIdsInDB, $businessIds);
        if (!count($removeBusinessIds)) {
            return true;
        }

        $businessHourPrices = $this->businessHourRepository
            ->getBusinessHourPricesOfBusinessHourIds($removeBusinessIds);

        return !count($businessHourPrices);
    }
}