<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;

class BillingService
{
    protected $orderGroupRepository;
    protected $orderRepository;
    protected $servicePlanRepository;
    protected $tPaymentRepository;

    public function __construct(
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository
    ) {
        $this->orderGroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
    }

    /**
     * Checkout ordergroup
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function payRequest(MShop $shop, TOrderGroup $ordergroup)
    {
        $ordergroupData = $ordergroup->toArray();
        $ordergroupId = $ordergroup->id;
        $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.REQUEST_CHECKOUT');

        $ordergroup = $this->orderGroupRepository->updateOrderGroup($ordergroupId, $ordergroupData);

        return $ordergroup->load(
            $this->orderGroupRepository->queryGetOrdersDataOfOrderGroup()
        );
    }

    /**
     * Finish billing table
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function finishBilling(MShop $shop, TOrderGroup $ordergroup = null)
    {
        $ordergroupId = $ordergroup->id;
        $ordergroupData = $ordergroup->toArray();
        $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.CHECKED_OUT');
        $ordergroupData['order_blocked'] = 0;

        return $this->orderGroupRepository->updateOrderGroup($ordergroupId, $ordergroupData);
    }

    /**
     * Paying
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @param bool $flagUpdate
     * @return mixed
     */
    public function paying(MShop $shop, TOrderGroup $ordergroup, $flagUpdate)
    {
        $ordergroupId = $ordergroup->id;
        $ordergroupData = $ordergroup->only([
            'status',
            'order_blocked',
            'count',
            'total_billing',
            'payment_request_time',
            'number_of_customers',
        ]);

        if ($flagUpdate) {
            $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.WAITING_CHECKOUT');
        } else {
            $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.ORDERING');
            // Re-caculate the number of extend course times after re-open waitting checkout for order
            $this->calculateExtendCourseTimes($ordergroup);
        }

        return $this->orderGroupRepository->updateOrderGroup($ordergroupId, $ordergroupData);
    }

    /**
     * Re-caculate the number of extend course times
     *
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function calculateExtendCourseTimes(TOrderGroup $ordergroup)
    {
        return $this->orderRepository->calculateExtendCourseTimes($ordergroup);
    }
}
