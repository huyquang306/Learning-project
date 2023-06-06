<?php

/**
 * Round price by option
 * @param int   $mode
 * @param float $value
 *
 * @return int
 */
function roundPrice(int $mode, float $value): int
{
    switch ($mode) {
        case \App\Models\MShopPosSetting::ROUND_UP_PRICE_FRACTION_MODE:
            return ceil($value);
        case \App\Models\MShopPosSetting::ROUND_PRICE_FRACTION_MODE:
            return round($value);
        case \App\Models\MShopPosSetting::ROUND_DOWN_PRICE_FRACTION_MODE:
        default:
            return floor($value);
    }
}

/**
 * Get menu|order|coursePrice price
 * @param object|null $menu (mMenu|TOrder)
 * @param int         $type (1-menu, 2-order, 3-coursePrice)
 * @param object|null $course
 * @param string|null $time
 *
 * @return array [order_id, menu_id, price_unit_with_tax, tax_value, tax_rate, price_unit_without_tax, in_course]
 */
function getMenuPriceHelper(?object $menu, int $type = 1, object $course = null, string $time = null): array
{
    switch ($type) {
        // Case type is 3 : input is CoursePrice
        case config('const.function_helper.menu_price.course_price_type'):
            return getCoursePriceHelper($course);

        // Case type is 2 : input is TOrder
        case config('const.function_helper.menu_price.order_type'):
            return getTOrderPriceHelper($menu);

        // Case type is 1: input is MMenu
        case config('const.function_helper.menu_price.menu_type'):
        default:
            return getMMenuPriceHelper($menu, $course, $time);
    }
}

/**
 * Get course_price price
 * @param object $coursePrice
 *
 * @return array [order_id, menu_id, price_unit_with_tax, tax_value, tax_rate, price_unit_without_tax, in_course]
 */
function getCoursePriceHelper(object $coursePrice): array
{
    $taxRate = $coursePrice->mTax ? $coursePrice->mTax->tax_rate : 0;

    return makePriceDataHelper(
        null,
        null,
        $coursePrice->unit_price,
        $coursePrice->tax_value,
        $taxRate,
        (int) $coursePrice->unit_price - (int) $coursePrice->tax_value
    );
}

/**
 * Get order price
 * @param object $order
 *
 * @return array [order_id, menu_id, price_unit_with_tax, tax_value, tax_rate, price_unit_without_tax, in_course]
 */
function getTOrderPriceHelper(object $order): array
{
    return makePriceDataHelper(
        $order->id,
        null,
        $order->price_unit,
        $order->tax_value,
        $order->tax_rate,
        (int) $order->price_unit - (int) $order->tax_value
    );
}

/**
 * Get MMenu price
 * @param object      $menu (mMenu|TOrder)
 * @param object|null $course
 * @param string|null $time
 *
 * @return array [order_id, menu_id, price_unit_with_tax, tax_value, tax_rate, price_unit_without_tax, in_course]
 */
function getMMenuPriceHelper(object $menu, object $course = null, string $time = null): array
{
    // Format data input
    $time = $time ? \Carbon\Carbon::parse($time) : now();
    $taxRate = $menu->mTax ? $menu->mTax->tax_rate : 0;

    // Case 1.1: menu in course
    if ($course && $course->mActiveMenus) {
        $activeMenuIds = $course->mActiveMenus->pluck('id')->values()->toArray();
        if (in_array($menu->id, $activeMenuIds)) {
            return makePriceDataHelper(
                null,
                $menu->id,
                0,
                0,
                $taxRate,
                0,
                true
            );
        }
    }

    // Case 1.2: menu is not in course
    $isInBusinessHourPrice = getBusinessHourPriceSuitableTime($menu, $time);

    // Case 1.2.1: exist menu price suitable time
    if ($isInBusinessHourPrice) {
        return makePriceDataHelper(
            null,
            $menu->id,
            $isInBusinessHourPrice->price,
            $isInBusinessHourPrice->tax_value,
            $taxRate,
            (int) $isInBusinessHourPrice->price - (int) $isInBusinessHourPrice->tax_value
        );
    }

    // Case 1.2.2: Do not exist menu price suitable time, get default menu price
    return makePriceDataHelper(
        null,
        $menu->id,
        $menu->price,
        $menu->tax_value,
        $taxRate,
        (int) $menu->price - (int) $menu->tax_value
    );
}

/**
 * Get businessHourPrice suitable time
 * @param object $menu
 * @param string $time
 *
 * @return object|null
 */
function getBusinessHourPriceSuitableTime(object $menu, string $time): ?object
{
    $mBusinessHourPrices = $menu->mBusinessHourPrices;
    $businessHourPrice = null;
    if (count($mBusinessHourPrices)) {
        for ($index = 0; $index < count($mBusinessHourPrices); $index++) {
            // Check display flag for business hour prices
            if (!$mBusinessHourPrices[$index]->display_flg) {
                continue;
            }
            // Check relation loaded
            if (!$mBusinessHourPrices[$index]->relationLoaded('mShopBusinessHour')) {
                $mBusinessHourPrices[$index]->load('mShopBusinessHour');
            }
            $mBusinessHour = $mBusinessHourPrices[$index]->mShopBusinessHour;
            if ($mBusinessHour) {
                $startTime = \Carbon\Carbon::parse($mBusinessHour->start_time);
                $finishTime = \Carbon\Carbon::parse($mBusinessHour->finish_time);
                if ($startTime > $finishTime) {
                    $finishTime = \Carbon\Carbon::parse($mBusinessHour->finish_time)->add('day', 1);
                }

                if ($startTime <= $time && $time <= $finishTime) {
                    $businessHourPrice = $mBusinessHourPrices[$index];
                    break;
                }
            }
        }
    }

    return $businessHourPrice;
}

/**
 * Make price data
 * @param int|null $orderId
 * @param int|null $menuId
 * @param int $priceUnitWithTax
 * @param int $taxValue
 * @param float $taxRate
 * @param int $priceUnitWithoutTax
 * @param bool $inCourse
 * @return array [order_id, menu_id, price_unit_with_tax, tax_value, tax_rate, price_unit_without_tax, in_course]
 */
function makePriceDataHelper(
    ?int  $orderId,
    ?int  $menuId,
    int   $priceUnitWithTax,
    int   $taxValue,
    float $taxRate,
    int   $priceUnitWithoutTax,
    bool  $inCourse = false
): array
{
    return [
        'order_id' => $orderId,
        'menu_id' => $menuId,
        'price_unit_with_tax' => $priceUnitWithTax,
        'tax_value' => $taxValue,
        'tax_rate' => $taxRate,
        'price_unit_without_tax' => $priceUnitWithoutTax,
        'in_course' => $inCourse,
    ];
}
