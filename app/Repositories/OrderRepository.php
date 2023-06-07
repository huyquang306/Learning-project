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
}
