<?php

namespace App\Services\Shop;

use App\Http\Controllers\Api\Shop\Collection;
use App\Http\Requests\Shop\OrderRequest;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Repositories\Interfaces\StaffRepositoryInterface as StaffRepository;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use App\Services\PrinterService;

class OrderService
{
    protected $orderRepository;
    protected $staffRepository;
    protected $orderGroupRepository;
    protected $printerService;

    public function __construct(
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository,
        PrinterService $printerService,
        StaffRepository $staffRepository
    ) {
        $this->orderGroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
        $this->staffRepository = $staffRepository;
        $this->printerService = $printerService;
    }

    /**
     * @param OrderRequest $request
     * @param MShop $shop
     * @param TOrderGroup $orderGroup
     * @return Collection
     */
    public function createOrder(OrderRequest $request, MShop $shop, TOrderGroup $orderGroup)
    {
        $orderParams = $request->get('orders');
        $orders = $this->orderRepository->createOrder($orderParams, $shop, $orderGroup);
        if ($request->add_without_menus) {
            $ordersWithoutMenus = $this->orderRepository
                ->addOrdersWithoutMenu($orderGroup, $request->add_without_menus);
            $orders = $orders->merge($ordersWithoutMenus);
        }
        foreach ($orders as $order) {
            $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
            $order->price_unit = $currentPrice['price_unit_with_tax'];
            $order->current_price = $currentPrice;
        }

        return $orders;
    }
}
