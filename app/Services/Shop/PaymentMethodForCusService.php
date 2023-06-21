<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Repositories\Interfaces\PaymentMethodForCusRepositoryInterface as PaymentMethodRepository;

class PaymentMethodForCusService
{
    protected $paymentMethodRepository;

    public function __construct(PaymentMethodRepository $paymentMethodRepository)
    {
        $this->paymentMethodRepository = $paymentMethodRepository;
    }
    /**
     * Get all payment method for customer in system
     * @param MShop $shop
     *
     * @return Collection
     */
    public function getPaymentMethodsByShop(MShop $shop)
    {
        return $this->paymentMethodRepository->getPaymentMethodsForCustomer($shop);
    }

}