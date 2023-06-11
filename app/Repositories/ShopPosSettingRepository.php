<?php

namespace App\Repositories;

use App\Models\MPaymentMethod;
use App\Models\MShop;
use App\Models\MShopPosSetting;
use App\Repositories\Interfaces\ShopPosSettingRepositoryInterface;
use Illuminate\Support\Collection;

class ShopPosSettingRepository extends BaseRepository implements ShopPosSettingRepositoryInterface
{
    public function getModel(): string
    {
        return MShopPosSetting::class;
    }

    /**
     * Get shop tax info
     *
     * @param MShop $shop
     * @return MShopPosSetting|null
     */
    public function getTaxInfo(MShop $shop): ?MShopPosSetting
    {
        return $this->model->with([
            'mCurrency',
        ])->where('m_shop_id', $shop->id)
            ->first();
    }

    /**
     * Update shop tax info
     * @param MShop $shop
     * @param array $taxInfo
     *
     * @return MShopPosSetting
     */
    public function updateShopTax(MShop $shop, array $taxInfo): ?MShopPosSetting
    {
        $tax = $this->model->where('m_shop_id', $shop->id)
            ->first();
        //$paymentMethodIds = $taxInfo['payment_method_ids'];
        unset($taxInfo['payment_method_ids']);
        // Update tax info
        $tax = $this->update($tax->id, $taxInfo);

        // Update payment methods for shop
        /*
        $canSavePaymentMethodIds = MPaymentMethod::whereIn('id', $paymentMethodIds)
            ->where('m_country_id', $shop->m_country_id)
            ->get()->pluck('id')->values();
        $syncData = [];
        $dateData = [
            'created_at' => now(),
            'updated_at' => now(),
        ];
        foreach ($canSavePaymentMethodIds as $methodId) {
            $syncData[$methodId] = $dateData;
        }
        $shop->mPaymentMethods()->sync($syncData);
        */

        return $tax->load([
            'mCurrency',
        ]);
    }

    /**
     * Get shop tax options
     * @param MShop $shop
     *
     * @return Collection
     */
    public function getTaxOptions(MShop $shop): Collection
    {
        $shop->load('mCountry.mTaxs');

        if ($shop->mCountry) {
            return $shop->mCountry->mTaxs;
        }

        return collect([]);
    }
}
