<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Repositories\OrderGroupRepository;
use Illuminate\Http\Request;

class OrderGroupService
{
    protected $orderGroupRepository;

    public function __construct(
        OrderGroupRepository $orderGroupRepository
    ) {
        $this->orderGroupRepository = $orderGroupRepository;
    }

    /**
     * Get shop's order group summary
     *
     * @param Request $request
     * @param MShop $shop
     * @return mixed
     */
    public function getSummary(Request $request, MShop $shop)
    {
        $dataFilter = $request->all();
        $orderGroups = $this->orderGroupRepository->getSummary($dataFilter, $shop);

        foreach ($orderGroups as $orderGroup) {
            $listFirstIdOrdersOfOrdergroup = $this->getListFirstOrdersOfOrdergroup($orderGroup);
            if (!empty($listFirstIdOrdersOfOrdergroup)) {
                $tOrders = $orderGroup->tOrders ?? [];
                foreach ($tOrders as $tOrder) {
                    $tOrder->is_first_order = false;
                    if (in_array($tOrder->id, $listFirstIdOrdersOfOrdergroup)) {
                        $tOrder->is_first_order = true;
                    }
                }
            }
        }

        return $orderGroups;
    }

    /**
     * Get list of the first orders of ordergroup
     *
     * @param TOrderGroup $ordergroup
     * @return array
     */
    public function getListFirstOrdersOfOrdergroup(TOrderGroup $ordergroup): array
    {
        $orderIdsResult = [];
        $tOrders = $ordergroup->tOrders ?? [];
        $orderNotIncludeCourseIds = [];
        $timeCheckFirstListOrders = null;

        foreach ($tOrders as $tOrder) {
            if ($tOrder->order_type === config('const.ORDER_TYPE.ORDER_MENU')
                || $tOrder->order_type === config('const.ORDER_TYPE.ORDER_WITHOUT_MENU')
            ) {
                $orderNotIncludeCourseIds[] = $tOrder->id;
            }
        }

        $firstOrderId = array_shift($orderNotIncludeCourseIds);

        foreach ($tOrders as $tOrder) {
            if ($tOrder->id === $firstOrderId) {
                $timeCheckFirstListOrders = Carbon::parse($tOrder->ordered_at)->addMinutes();
            }
            if (Carbon::parse($tOrder->ordered_at)->lte($timeCheckFirstListOrders)) {
                $orderIdsResult[] = $tOrder->id;
            }
        }

        return $orderIdsResult;
    }

    /**
     * Get table of order groups
     *
     * @param $orderGroups
     * @return mixed
     */
    public function getTablesOfOrderGroups($orderGroups)
    {
        return $this->orderGroupRepository->getTablesOfOrderGroups($orderGroups);
    }
}
