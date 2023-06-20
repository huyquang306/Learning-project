<?php

namespace App\Services\Shop;

use App\Http\Controllers\Api\Shop\Collection;
use App\Http\Requests\Shop\OrderRequest;
use App\Models\MShop;
use App\Models\TOrder;
use App\Models\TOrderGroup;
use App\Repositories\Interfaces\StaffRepositoryInterface as StaffRepository;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use App\Services\PrinterService;
use Illuminate\Support\Facades\DB;

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
     * @return mixed
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


    /**
     * Create|Update|Cancel menu orders
     * @param $request
     * @param MShop $shop
     * @param TOrderGroup $orderGroup
     * @return TOrderGroup
     * @throws \Exception
     */
    public function updateMenu($request, MShop $shop, TOrderGroup $orderGroup): TOrderGroup
    {
        try {
            DB::beginTransaction();
            $position = config('const.PRINTER_POSITIONS.KITCHEN.value');

            if ($request->add_menu) {
                $orders = $this->orderRepository->addMenus($request->add_menu, $shop, $orderGroup);
                foreach ($orders as $order) {
                    $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
                    $order->price_unit = $currentPrice['price_unit_with_tax'];
                    $order->current_price = $currentPrice;
                }
                $outputFile = $this->printerService->createCreateOrderTemplate(
                    $shop,
                    $orderGroup,
                    $orders,
                    TOrder::ADD_ORDER_TYPE
                );
                //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);
            }

            if ($request->add_without_menus) {
                $orders = $this->orderRepository->addOrdersWithoutMenu($orderGroup, $request->add_without_menus);
                $outputFile = $this->printerService->createCreateOrderTemplate(
                    $shop,
                    $orderGroup,
                    $orders,
                    TOrder::ADD_ORDER_TYPE
                );
                //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);
            }

            if ($request->cancel_orders) {
                $orders = $this->orderRepository->cancelMenus($request->cancel_orders);
                foreach ($orders as $order) {
                    $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
                    $order->price_unit = $currentPrice['price_unit_with_tax'];
                    $order->current_price = $currentPrice;
                }
                $outputFile = $this->printerService->createCreateOrderTemplate(
                    $shop,
                    $orderGroup,
                    $orders,
                    TOrder::CANCEL_ORDER_TYPE
                );
                $this->printerService->insertJobQueue($shop->id, $outputFile, $position);
            }

            if ($request->update_orders) {
                $order_ids = [];

                $update_status = false;
                foreach ($request->update_orders as $order) {
                    if (isset($order['status'])) {
                        $update_status = true;
                    }
                    $order_ids[] = $order['id'];
                }
                $ordersOld = $this->orderRepository->getOrderQuantityOld($order_ids);
                $orders = $this->orderRepository->updateMenus($request->update_orders);
                foreach ($orders as $order) {
                    $currentPrice = getMenuPriceHelper($order, config('const.function_helper.menu_price.order_type'));
                    $order->price_unit = $currentPrice['price_unit_with_tax'];
                    $order->current_price = $currentPrice;
                }

                if (!$update_status) {
                    $outputFile = $this->printerService->createCreateOrderTemplate(
                        $shop,
                        $orderGroup,
                        $orders,
                        TOrder::UPDATE_ORDER_TYPE,
                        $ordersOld
                    );
                    //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);
                }
            }
            DB::commit();

            return $orderGroup->load(
                $this->orderGroupRepository->queryGetOrdersDataOfOrderGroup()
            );
        } catch (\Exception $exception) {
            DB::rollBack();
            throw $exception;
        }
    }
}
