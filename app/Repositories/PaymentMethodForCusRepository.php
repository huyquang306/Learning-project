<?php

namespace App\Repositories;

use App\Models\MPaymentMethod;
use App\Models\MShop;
use App\Repositories\Interfaces\PaymentMethodForCusRepositoryInterface;

class PaymentMethodForCusRepository extends BaseRepository implements PaymentMethodForCusRepositoryInterface
{

    public function getModel()
    {
        return MPaymentMethod::class;
    }

    /**
     * @param MShop $shop
     * @return mixed
     */
    public function getPaymentMethodsByShop(MShop $shop)
    {
        $shop->load('mPaymentMethods');

        return $shop->mPaymentMethods;
    }

    /**
     * @param MShop $shop
     * @return mixed
     */
    public function getPaymentMethodsForCustomer(MShop $shop)
    {
        return $this->model->where('m_country_id', $shop->m_country_id)
            ->with('mCountry')
            ->get();
    }
}