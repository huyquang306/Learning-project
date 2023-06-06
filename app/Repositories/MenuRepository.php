<?php

namespace App\Repositories;

use App\Models\MMenu;
use App\Models\MShop;

class MenuRepository
{
    /**
     * @param $shop_id
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getMenuRecommendWithCategories($shop_id)
    {
        $query = MMenu::query();

        $query->whereIn('m_menu.id', function ($queryTable) use ($shop_id) {
            $queryTable->from('r_shop_menu')
                ->select('m_menu_id')
                ->where('r_shop_menu.m_shop_id', $shop_id);
        });

        $query->where('is_recommend', 1);

        $query->with(['rShopMenu' => function ($q) use ($shop_id) {
            $q->where('m_shop_id', $shop_id)
                ->with(['mMenuCategory' => function ($q) {
                    $q->where('tier_number', 2);
                }]);
        }]);

        return $query->get();
    }

    /**
     * Get initial order menus
     *
     * @param MShop $shop
     * @return mixed
     */
    public function getInitialOrderMenusByShop(MShop $shop)
    {
        return MMenu::where('initial_order_flg', MMenu::INITIAL_ORDER_MENU_FLAG_TRUE)
            ->where('status', MMenu::ON_SALE_STATUS)
            ->whereHas('mShops', function ($mShopQuery) use ($shop) {
                return $mShopQuery->where('m_shop.id', $shop->id);
            })->get();
    }
}
