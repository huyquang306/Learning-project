<?php

namespace App\Services\Shop;

use App\Http\Requests\Shop\OrderGroupRequest;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Repositories\MenuRepository;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use Carbon\Carbon;
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
     * @param $request
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return TOrderGroup|mixed
     */
    public function updateOrderGroup($request, MShop $shop, TOrdergroup $ordergroup)
    {
        // get data request
        $data = [
            'm_shop_id' => $shop->id,
            'add_hash_id' => $request->add_hash_id,
            'number_of_customers' => $request->number_of_customers,
        ];

        $ordergroup = $this->orderGroupRepository->updateOrderGroupShop($data, $ordergroup);

        // Order Course
        if ($request->course_hash_id && $request->course_price_hash_id) {
            $tOrderData = [
                'course_hash_id' => $request->course_hash_id,
                'course_price_hash_id' => $request->course_price_hash_id,
                'quantity' => $request->number_of_customers,
            ];

            $this->orderRepository->createOrder([$tOrderData], $shop, $ordergroup);
        }

        $orders = $ordergroup->tOrders->load('rShopMenu.mMenu');
        // Update number customer of course
        if ($request->number_of_customers_of_course && $orders && count($orders)) {
            $dataOrderUpdate = [];

            foreach ($orders as $order) {
                // OrderGroup has main course
                if ($order->r_shop_course_id && $order->order_type == config('const.ORDER_TYPE.ORDER_COURSE')) {
                    $dataOrderUpdate = [
                        'id' => $order->id,
                        'quantity' => $request->number_of_customers_of_course,
                    ];
                    break;
                }
            }

            if (!empty($dataOrderUpdate)) {
                $this->orderRepository->updateMenus([$dataOrderUpdate]);
            }
        }

        // Update quantity of initial menu orders
        $numberOfCustomers = $request->number_of_customers;
        if ($request->is_update_initial_menu_orders && $orders && count($orders)) {
            $dataOrders = collect($orders)->filter(function ($order) {
                return $order->order_type === config('const.ORDER_TYPE.ORDER_MENU')
                    && $order->rShopMenu
                    && $order->rShopMenu->mMenu
                    && $order->rShopMenu->mMenu->initial_order_flg;
            })->map(function ($order) use ($numberOfCustomers) {
                return [
                    'id' => $order->id,
                    'quantity' => $numberOfCustomers,
                ];
            });

            if (!empty($dataOrders)) {
                $this->orderRepository->updateMenus($dataOrders);
            }
        }

        return $ordergroup;
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

    /**
     * Update Bill Pdf FilePath
     *
     * @param TOrderGroup $ordergroup
     * @param string $s3_path
     * @return TOrderGroup|mixed
     */
    public function updateBillPdfFilePath(TOrdergroup $ordergroup, string $s3_path)
    {
        return $this->orderGroupRepository->updateOrderGroupBillPdfFilePath($ordergroup, $s3_path);
    }

    /**
     * Delete order group
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function deleteOrderGroup(MShop $shop, TOrderGroup $ordergroup)
    {
        return $this->orderGroupRepository->deleteOrderGroup($ordergroup);
    }

    /**
     * Get orderGroup with orders data (menu|course)
     *
     * @param TOrderGroup $ordergroup
     * @param array       $statuses
     * @return mixed
     */
    public function getOrderGroupWithOrdersData(TOrderGroup $ordergroup, array $statuses)
    {
        return $ordergroup->load(
            $this->orderGroupRepository->queryGetOrdersDataOfOrderGroup($statuses)
        );
    }

    /**
     * Extend order course for t_ordergroup
     * @param array $tOrderData
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     *
     * @return TOrderGroup|null
     * @throw  Exception
     * @throws Exception|\Exception
     */
    public function extendCourse(array $tOrderData, MShop $shop, TOrderGroup $ordergroup): ?TOrderGroup
    {
        if (!$this->orderGroupRepository->checkCourseCanExtend($ordergroup)) {
            return null;
        }

        if ($ordergroup->status == config('const.STATUS_ORDERGROUP.PRE_ORDER')
            || $ordergroup->status == config('const.STATUS_ORDERGROUP.ORDERING')
        ) {
            $this->orderRepository->createOrder([$tOrderData], $shop, $ordergroup);

            return $ordergroup->load(
                $this->orderGroupRepository->queryGetOrdersDataOfOrderGroup()
            );
        }

        // this_table_cannot_extend
        throw new \Exception('Set ăn này đã kết thúc, và không thể tiếp tục');
    }
}
