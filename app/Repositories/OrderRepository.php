<?php

namespace App\Repositories;

use App\Models\MCourse;
use App\Models\MCoursePrice;
use App\Models\MMenu;
use App\Models\MShop;
use App\Models\MShopPosSetting;
use App\Models\MUser;
use App\Models\TOrder;
use App\Models\TOrderGroup;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class OrderRepository extends BaseRepository
{
    public function getModel(): string
    {
        return TOrder::class;
    }

    /**
     * Order product new registration
     *
     * @param array $order_params
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     *
     * @return mixed
     */
    public function createOrder(array $order_params, MShop $shop, TOrderGroup $ordergroup)
    {
        $orders = new Collection();
        $now = now();

        DB::beginTransaction();
        foreach ($order_params as $value) {
            $user_hash_id = $value['user_hash_id'] ?? '';
            $course_hash_id = $value['course_hash_id'] ?? '';
            $course_price_hash = $value['course_price_hash_id'] ?? '';
            $menu_hash_id = $value['menu_hash_id'] ?? '';
            $quantity = $value['quantity'];
            $menu = $menu_hash_id
                ? MMenu::where('hash_id', $menu_hash_id)->with('mTax')->first()
                : null;
            $course = $course_hash_id ? MCourse::where('hash_id', $course_hash_id)->first() : null;
            $course_price = $course_price_hash ? MCoursePrice::where('hash_id', $course_price_hash)->first() : null;
            $user = $user_hash_id ? MUser::where('hash_id', $user_hash_id)->first() : null;
            $rShopCourseId = $course ? $course->rShopCourse->id : null;

            // get shop pos setting
            $shop->load('mShopPosSetting');
            $taxOption = $shop->mShopPosSetting;
            $priceFractionMode = $taxOption
                ? $taxOption->price_fraction_mode
                : MShopPosSetting::ROUND_DOWN_PRICE_FRACTION_MODE;

            // Init tax value
            $taxRate = 0;
            $taxValue = 0;

            // Case order course
            if ($course && $course_price) {
                $coursePriceCurrentPrice = getMenuPriceHelper(
                    null,
                    config('const.function_helper.menu_price.course_price_type'),
                    $course_price
                );
                $price = $coursePriceCurrentPrice['price_unit_with_tax'];
                $taxRate = $coursePriceCurrentPrice['tax_rate'];
                $taxValue = roundPrice($priceFractionMode, $coursePriceCurrentPrice['tax_value']);
                $order_type = $course->parent_id ?
                    config('const.ORDER_TYPE.ORDER_EXTEND_COURSE') : config('const.ORDER_TYPE.ORDER_COURSE');
            }

            // Case order menu
            if ($menu) {
                $newOrderStatus = config('const.STATUS_ORDER');
                $menuCurrentPrice = getMenuPriceHelper(
                    $menu,
                    config('const.function_helper.menu_price.menu_type'),
                    $course
                );
                $price = $menuCurrentPrice['price_unit_with_tax'];
                $taxRate = $menuCurrentPrice['tax_rate'];
                $taxValue = roundPrice($priceFractionMode, $menuCurrentPrice['tax_value']);
                $order_type = config('const.ORDER_TYPE.ORDER_MENU');
                if (!$menuCurrentPrice['in_course']) {
                    $rShopCourseId = null;
                }
            } else {
                // Order a course only
                $newOrderStatus = config('const.STATUS_FINISH');
            }

            $r_shop_menu = $menu ? $shop->mMenus->find($menu->id) : null;
            if ($r_shop_menu != null || $course != null) {
                $new_order = new TOrder();
                $new_order->t_ordergroup_id = $ordergroup->id;
                $new_order->r_shop_menu_id = $menu ? $r_shop_menu->pivot->id : null;
                $new_order->r_shop_course_id = $rShopCourseId;
                $new_order->m_user_id = $user->id ?? null;
                $new_order->order_type = $order_type;
                $new_order->status = $newOrderStatus;
                $new_order->price_unit = $price;
                $new_order->quantity = $quantity;
                $new_order->tax_rate = $taxRate;
                $new_order->tax_value = $taxValue;
                $new_order->amount = $quantity * $price;
                $new_order->ordered_at = array_key_exists('ordered_at', $value) && $value['ordered_at']
                    ? $value['ordered_at']
                    : $now;
                $new_order->save();
                $orders->add($new_order);
            }
        }

        $ordergroup->fill(['status' => config('const.STATUS_ORDERGROUP.ORDERING')])->save();
        DB::commit();

        return $orders;
    }

    /**
     * Add orders that is not menu
     * @param TOrderGroup $orderGroup
     * @param array       $addCustomMenus
     * @return Collection
     */
    public function addOrdersWithoutMenu(TOrderGroup $orderGroup, array $addCustomMenus)
    {
        $orders = new Collection();
        foreach ($addCustomMenus as $menu) {
            $menuPrice = $menu['price'] ?? 0;
            $menuQuantity = $menu['quantity'] ?? 0;
            $order = [
                't_ordergroup_id' => $orderGroup->id,
                'r_shop_menu_id' => 0,
                'r_shop_course_id' => null,
                'menu_name' => $menu['menu_name'],
                'price_unit' => $menuPrice,
                'quantity' => $menuQuantity,
                'amount' => $menuPrice * $menuQuantity,
                'tax_rate' => $menu['tax_rate'] ?? 0,
                'tax_value' => $menu['tax_value'] ?? 0,
                'order_type' => config('const.ORDER_TYPE.ORDER_WITHOUT_MENU'),
                'ordered_at' => now(),
            ];
            $order = TOrder::create($order);
            $orders->add($order);
        }

        return $orders;
    }

    /**
     * @param $add_menu
     * @param $shop
     * @param $orderGroup
     * @return Collection
     */
    public function addMenus($add_menu, $shop, $orderGroup): Collection
    {
        $orders = new Collection();

        foreach ($add_menu as $item) {
            $menu = MMenu::where('hash_id', $item['menu_hash_id'])
                ->with('mTax')
                ->first();
            $course = array_key_exists('course_hash_id', $item)
                ? MCourse::where('hash_id', $item['course_hash_id'])->first()
                : null;
            if ($menu) {
                $menuCurrentPrice = getMenuPriceHelper(
                    $menu,
                    config('const.function_helper.menu_price.menu_type'),
                    $course
                );

                $shop->load('mShopPosSetting');
                $taxOption = $shop->mShopPosSetting;
                $priceFractionMode = $taxOption
                    ? $taxOption->price_fraction_mode
                    : MShopPosSetting::ROUND_DOWN_PRICE_FRACTION_MODE;

                $r_shop_menu_id = $menu->rShopMenu($shop->id)->first();

                $item['t_ordergroup_id'] = $orderGroup->id;
                $item['r_shop_menu_id'] = $r_shop_menu_id->id;
                $item['r_shop_course_id'] = null;
                $item['price_unit'] = $menuCurrentPrice['price_unit_with_tax'];
                $item['amount'] = $item['quantity'] * $menuCurrentPrice['price_unit_with_tax'];
                $item['tax_rate'] = $menuCurrentPrice['tax_rate'];
                $item['tax_value'] = roundPrice($priceFractionMode, $menuCurrentPrice['tax_value']);
                $item['order_type'] = config('const.ORDER_TYPE.ORDER_MENU');
                $item['ordered_at'] = now();

                $order = new TOrder();
                $order->fill($item)->save();
                $orders->add($order);
            }
        }

        return $orders;
    }

    /**
     * @param $cancel_orders
     * @return Collection
     */
    public function cancelMenus($cancel_orders): Collection
    {
        $orders = new Collection();
        foreach ($cancel_orders as $order) {
            $order = TOrder::where('id', $order)->first();
            if ($order->order_type == config('const.ORDER_TYPE.ORDER_COURSE')) {
                // Cancel course -> Cancel extend course
                $orderExtendCourses = TOrder::where([
                    't_ordergroup_id' => $order->t_ordergroup_id,
                    'order_type' => config('const.ORDER_TYPE.ORDER_EXTEND_COURSE'),
                ])->get();

                if (!empty($orderExtendCourses)) {
                    foreach ($orderExtendCourses as $orderExtendCourse) {
                        $orderExtend = TOrder::where('id', $orderExtendCourse->id)->first();
                        $orderExtend->status = config('const.STATUS_CANCEL');
                        $orderExtend->amount = 0;
                        $orderExtend->save();
                        $orders->add($orderExtend);
                    }
                }
            }

            $order->status = config('const.STATUS_CANCEL');
            $order->amount = 0;
            $order->save();
            $orders->add($order);
        }

        return $orders;
    }

    /**
     * @param $orders
     * @return mixed
     */
    public function getOrderQuantityOld($orders)
    {
        return TOrder::whereIn('id', $orders)->get();
    }

    /**
     * Update some menus in ordergroup
     * @param $updateOrders
     * @return Collection
     */
    public function updateMenus($updateOrders): Collection
    {
        $orders = new Collection();
        foreach ($updateOrders as $updateOrder) {
            $data['quantity'] = $updateOrder['quantity'];
            $order = TOrder::where('id', $updateOrder['id'])->first();
            $priceUnit = $order->price_unit ?? 0;
            $data['amount'] = $data['quantity'] * $priceUnit;

            // Check order status, if cancel then amount is 0
            if (isset($updateOrder['status'])) {
                // Case: update order status to cancel
                $data['status'] = $updateOrder['status'];
                if ($data['status'] == config('const.STATUS_CANCEL')) {
                    $data['amount'] = 0;
                }
            } elseif ($order->status == config('const.STATUS_CANCEL')) {
                // Case: Current order status is cancelled
                $data['amount'] = 0;
            }

            $order->fill($data)->save();
            $orders->add($order);
        }

        return $orders;
    }

    /**
     * Calculate extend course time
     *
     * @param TOrdergroup $ordergroup
     * @return Collection
     */
    public function calculateExtendCourseTimes(TOrdergroup $ordergroup)
    {
        DB::beginTransaction();

        $orders = $ordergroup->tOrders;
        $mainCourse = null;
        $startTimeOfMainCourse = null;
        $extendCountNumber = 0;
        $quantity = 0;
        $newOrders = new Collection();

        foreach ($orders as $order) {
            // OrderGroup has main course
            if ($order->r_shop_course_id
                && $order->order_type === config('const.ORDER_TYPE.ORDER_COURSE')
                && $order->status != config('const.STATUS_CANCEL')
            ) {
                // Get main course
                $mainCourse = $order->rShopCourse->mCourse->load(['childCourses']);
                $startTimeOfMainCourse = $order->ordered_at;
                $quantity = $order->quantity;
            }
            // OrderGroup has extending course
            if ($order->r_shop_course_id
                && $order->order_type === config('const.ORDER_TYPE.ORDER_EXTEND_COURSE')
                && $order->status != config('const.STATUS_CANCEL')
            ) {
                // Get extend course of the main course
                $extendCountNumber = $extendCountNumber + 1;
            }
        }

        if ($mainCourse && $startTimeOfMainCourse) {
            $childCourses = $mainCourse->childCourses;
            $extendCourse = !empty($childCourses[0]) ? $childCourses[0] : null;
            $rShopCourseId = $extendCourse ? $extendCourse->rShopCourse->id : null;
            $extendCourseTimeBlock = $extendCourse ? $extendCourse->time_block_unit : 0;
            $extendCoursePrice = $extendCourse
                ? $extendCourse->rShopCourse->mCoursePrices()->withTrashed()->first()
                : null;
            $extendCoursePriceUnit = $extendCoursePrice ? $extendCoursePrice->unit_price : 0;
            $courseTime = $mainCourse->time_block_unit;

            // Check time order course
            $now = Carbon::now();

            // Get total time has inserted in the database
            $totalTimeCourseInDB = $courseTime + $extendCountNumber * $extendCourseTimeBlock;
            $totalRealSpendingTime = $now->diffInMinutes(Carbon::parse($startTimeOfMainCourse)->startOfMinute());

            // Get lack of time which need to insert more
            $additionalExtendCourseNumbers = $extendCourseTimeBlock
                ? ceil(($totalRealSpendingTime - $totalTimeCourseInDB) / $extendCourseTimeBlock)
                : 0;

            // Insert additional extend course times to t_order
            for ($i = 0; $i < $additionalExtendCourseNumbers; $i++) {
                $timeExtend = Carbon::parse($startTimeOfMainCourse)
                    ->addMinutes($totalTimeCourseInDB)
                    ->addMinutes($i * $extendCourseTimeBlock);

                // Create additional extend course
                $newOrder = new TOrder();
                $newOrder->t_ordergroup_id = $ordergroup->id;
                $newOrder->r_shop_menu_id = null;
                $newOrder->r_shop_course_id = $rShopCourseId;
                $newOrder->m_user_id = null;
                $newOrder->order_type = config('const.ORDER_TYPE.ORDER_EXTEND_COURSE');
                $newOrder->status = 0;
                $newOrder->price_unit = $extendCoursePriceUnit;
                $newOrder->quantity = $quantity;
                $newOrder->amount = $quantity * $extendCoursePriceUnit;
                $newOrder->ordered_at = $timeExtend->format('Y/m/d H:i:s');
                $newOrder->save();
                $newOrders->add($newOrder);
            }
        }

        DB::commit();

        return $newOrders;
    }
}
