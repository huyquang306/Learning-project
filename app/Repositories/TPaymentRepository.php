<?php

namespace App\Repositories;

use App\Models\TPayment;
use App\Repositories\Interfaces\TPaymentRepositoryInterface;

class TPaymentRepository extends BaseRepository implements TPaymentRepositoryInterface
{

    public function getModel(): string
    {
        return TPayment::class;
    }

    /**
     * Save customer payment information
     * @param array $paymentData
     */
    public function savePaymentsInformation(array $paymentData)
    {
        $tPayment = $this->create($paymentData);
        $tPaymentMethods = array_key_exists('t_payment_methods', $paymentData)
            ? $paymentData['t_payment_methods']
            : [];
        foreach ($tPaymentMethods as $paymentMethod) {
            $tPayment->tPaymentMethods()->create($paymentMethod);
        }
    }
}
