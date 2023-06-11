<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Models\MShopPosSetting;
use App\Repositories\Interfaces\ShopPosSettingRepositoryInterface as ShopPosRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ShopPosService
{
    protected $shopPosRepository;

    public function __construct(
        ShopPosRepository $shopPosRepository
    ) {
        $this->shopPosRepository = $shopPosRepository;
    }

    /**
     * Get shop tax info
     * @param MShop $shop
     *
     * @return MShopPosSetting|null
     */
    public function getTaxInfo(MShop $shop): ?MShopPosSetting
    {
        $tax = $this->shopPosRepository->getTaxInfo($shop);
        /*
        if ($tax) {
            $tax->payment_methods = $this->paymentMethodForCusRepository->getPaymentMethodsByShop($shop);
        }
        */

        return $tax;
    }

    /**
     * Update shop tax
     * @param MShop   $shop
     * @param Request $request
     *
     * @return MShopPosSetting
     */
    public function updateShopTax(MShop $shop, Request $request): MShopPosSetting
    {
        $taxInfo = $request->only([
            'price_fraction_mode',
            'total_amount_fraction_mode',
            'price_display_mode',
            'serve_charge_rate',
            'serve_charge_in_use',
            'payment_method_ids',
            'payment_method_ids.id',
        ]);
        $taxInfo['m_shop_id'] = $shop->id;

        $tax = $this->shopPosRepository->updateShopTax($shop, $taxInfo);
        /*
        if ($tax) {
            $tax->payment_methods = $this->paymentMethodForCusRepository->getPaymentMethodsByShop($shop);
        }
        */

        return $tax;
    }

    /**
     * Get shop tax options
     * @param MShop $shop
     *
     * @return Collection
     */
    public function getTaxOptions(MShop $shop): Collection
    {
        return $this->shopPosRepository->getTaxOptions($shop);
    }
}
