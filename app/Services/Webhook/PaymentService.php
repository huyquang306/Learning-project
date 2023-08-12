<?php

namespace App\Services\Webhook;

use App\Models\TServiceBilling;
use App\Repositories\Interfaces\ServiceBillingRepositoryInterface as ServiceBillingRepository;

class PaymentService
{
    protected $serviceBillingRepository;

    /**
     * PaymentService constructor.
     *
     * @param ServiceBillingRepository $serviceBillingRepository
     */
    public function __construct(ServiceBillingRepository $serviceBillingRepository)
    {
        $this->serviceBillingRepository = $serviceBillingRepository;
    }

    public function updateServiceBilling(TServiceBilling $serviceBilling, array $data)
    {
        return $this->serviceBillingRepository->updateServiceBilling($serviceBilling, $data);
    }

    public function getServiceBillingById($stripeId)
    {
        return $this->serviceBillingRepository->getBillingById($stripeId);
    }
}
