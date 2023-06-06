<?php

namespace App\Services;

use App\Http\Requests\Shop\OrderGroupRequest;
use App\Repositories\MenuRepository;
use App\Repositories\OrderRepository;
use Carbon\Carbon;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Repositories\OrderGroupRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderGroupService
{
    protected $orderGroupRepository;
    protected $orderRepository;
    protected $menuRepository;

    public function __construct(
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository,
        MenuRepository $menuRepository
    ) {
        $this->orderGroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
        $this->menuRepository = $menuRepository;
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

    /**
     * @param $table_hash_ids
     * @param null $ordergroup_id
     * @return bool
     */
    public function checkTableAvailable($table_hash_ids, $ordergroup_id = null): bool
    {
        return $this->orderGroupRepository->checkTablesAvailable($table_hash_ids, $ordergroup_id);
    }

    /**
     * @param OrderGroupRequest $request
     * @param MShop $shop
     * @return mixed
     * @throws \Exception
     */
    public function createOrderGroup(OrderGroupRequest $request, MShop $shop)
    {
        try {
            DB::beginTransaction();
            while (true) {
                $hash_id = makeHash();
                if ($this->orderGroupRepository->ordergroupDuplicateCheck('hash_id', $hash_id)) {
                    break;
                }
            }
            $data = [
                'm_shop_id' => $shop->id,
                'status' => config('const.STATUS_ORDERGROUP.PRE_ORDER'),
                'number_of_customers' => $request->number_of_customers,
                'hash_id' => $hash_id,
                'add_hash_id' => $request->add_hash_id,
            ];

            $ordergroup = $this->orderGroupRepository->createOrderGroupShop($data);

            // Order Course
            if ($request->course_hash_id && $request->course_price_hash_id) {
                $tOrderData = [
                    'course_hash_id' => $request->course_hash_id,
                    'course_price_hash_id' => $request->course_price_hash_id,
                    'quantity' => $request->number_of_customers,
                ];

                $this->orderRepository->createOrder([$tOrderData], $shop, $ordergroup);
            }
            DB::commit();

            return $ordergroup->load(
                $this->orderGroupRepository->queryGetOrdersDataOfOrderGroup()
            );
        } catch (\Exception $e) {
            DB::rollBack();

            throw $e;
        }
    }

    /**
     * Order initial menus when create a new t_ordergroup
     * @param MShop       $shop
     * @param TOrderGroup $orderGroup
     * @param Request $request
     * @return mixed
     */
    public function orderInitialMenus(MShop $shop, TOrderGroup $orderGroup, Request $request)
    {
        $initialMenus = $this->menuRepository->getInitialOrderMenusByShop($shop);
        if (!count($initialMenus)) {
            return collect([]);
        }

        $initialOrders = [];
        foreach ($initialMenus as $initialMenu) {
            $initialOrders[] = [
                'course_hash_id' => $request->course_hash_id,
                'menu_hash_id' => $initialMenu->hash_id,
                'quantity' => $request->number_of_customers,
            ];
        }

        $orders = $this->orderRepository->createOrder($initialOrders, $shop, $orderGroup);
        foreach ($orders as $order) {
            $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
            $order->price_unit = $currentPrice['price_unit_with_tax'];
            $order->current_price = $currentPrice;
        }

        return $orders;
    }

    /**
     * @param Request $request
     * @param MShop $shop
     * @return OrderGroupRepository[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getOrdergroups(Request $request, MShop $shop)
    {
        $dataFilter = $request->all();

        return $this->orderGroupRepository->getOrdergroups($dataFilter, $shop);
    }
}
