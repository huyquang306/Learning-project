<?php

namespace App\Repositories\Interfaces;

interface TPaymentRepositoryInterface
{
    public function savePaymentsInformation(array $paymentData);
}
