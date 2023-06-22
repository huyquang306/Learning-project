<?php

namespace App\Services\User;

use App\Models\MShop;
use App\Models\MShopPosSetting;
use App\Repositories\Interfaces\PaymentMethodForCusRepositoryInterface as PaymentMethodRepository;
use App\Repositories\Interfaces\ShopPosSettingRepositoryInterface as ShopPosSettingRepository;

class ShopService
{
    protected $shopPosSettingRepository;
    protected $paymentMethodForCusRepository;

    public function __construct(
        ShopPosSettingRepository $shopPosSettingRepository,
        PaymentMethodRepository $paymentMethodForCusRepository
    ) {
        $this->shopPosSettingRepository = $shopPosSettingRepository;
        $this->paymentMethodForCusRepository = $paymentMethodForCusRepository;
    }

    /**
     * Get shop tax info
     * @param MShop $shop
     *
     * @return MShopPosSetting|null
     */
    public function getTaxInfo(MShop $shop): ?MShopPosSetting
    {
        $taxInfo = $this->shopPosSettingRepository->getTaxInfo($shop);
        if ($taxInfo) {
            $taxInfo->payment_methods = $this->paymentMethodForCusRepository->getPaymentMethodsByShop($shop);
        }

        return $taxInfo;
    }
}