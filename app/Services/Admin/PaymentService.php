<?php

namespace App\Services\Admin;

use App\Models\MShop;
use App\Repositories\ShopRepository;

class PaymentService
{
    protected $shopRepository;

    public function __construct(ShopRepository $shopRepository)
    {
        $this->shopRepository = $shopRepository;
    }

    public function getCustomerPayment(MShop $shop)
    {
        $staffAuthorisePay = $this->shopRepository->getStaffAuthorisePayment($shop);
        if ($staffAuthorisePay && $staffAuthorisePay->tStripeCustomer) {
            try {
                $customerPayment = Customer::retrieve($staffAuthorisePay->tStripeCustomer->stripe_customer_id, []);
                if ($customerPayment) {
                    $customerPayment->payment_method = $staffAuthorisePay->tStripeCustomer->payment_method;

                    return $customerPayment;
                }
            } catch (\Exception $exception) {
                return null;
            }
        }

        return null;
    }
}