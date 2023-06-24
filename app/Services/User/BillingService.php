<?php

namespace App\Services\User;

use App\Models\TOrderGroup;
use App\Repositories\OrderGroupRepository;

class BillingService
{
    protected $orderGroupRepository;

    public function __construct(OrderGroupRepository $orderGroupRepository)
    {
        $this->orderGroupRepository = $orderGroupRepository;
    }

    /**
     * update request checkout
     *
     * @param TOrderGroup $ordergroup
     * @return TOrderGroup|null
     */
    public function updateRequestCheckout(TOrderGroup $ordergroup): ?TOrderGroup
    {
        $totalBilling = 0;
        if (count($ordergroup->tOrders)) {
            $orders = $ordergroup->tOrders;

            foreach ($orders as $order) {
                if ($order->status != config('const.STATUS_CANCEL')) {
                    $totalBilling += $order->amount;
                }
            }
        }

        return $this->orderGroupRepository->updateRequestCheckout($ordergroup, $totalBilling);
    }
}
