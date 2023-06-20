<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;

interface PaymentMethodForCusRepositoryInterface
{
    public function getPaymentMethodsByShop(MShop $shop);

    public function getPaymentMethodsForCustomer(MShop $shop);
}