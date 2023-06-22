<?php

namespace App\Services\User;

use App\Http\Requests\User\OrderRequest;
use App\Models\MMenu;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Repositories\OrderRepository;

class OrderService
{
    protected $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    /**
     * Create order
     * @param OrderRequest $request
     * @param MShop $shop
     * @param TOrdergroup $odergroup
     *
     * @return mixed
     */
    public function createOrder(OrderRequest $request, MShop $shop, TOrderGroup $odergroup)
    {
        $orderParams = $request->get('orders');
        $orders = $this->orderRepository->createOrder($orderParams, $shop, $odergroup);

        foreach ($orders as $order) {
            $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
            $order->current_price = $currentPrice;
            $order->price_unit = $currentPrice['price_unit_with_tax'];
        }

        return $orders;
    }

    /**
     * Order update
     * @param MShop $shop
     * @param TOrdergroup $ordergroup
     * @param  $request
     *
     * @return mixed
     */
    public function updateOrder($request, MShop $shop, TOrderGroup $ordergroup)
    {
        $orders = $this->orderRepository->updateOrder($request, $shop, $ordergroup);
        foreach ($orders as $order) {
            $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
            $order->current_price = $currentPrice;
            $order->price_unit = $currentPrice['price_unit_with_tax'];
        }

        return $orders;
    }

    /**
     * Order Delete
     * @param MShop $shop
     * @param MMenu $menu
     * @param TOrdergroup $ordergroup
     *
     * @return mixed
     */
    public function deleteOrder(MShop $shop, MMenu $menu, TOrderGroup $ordergroup)
    {
        return $this->orderRepository->deleteOrder($shop, $menu, $ordergroup);
    }
}