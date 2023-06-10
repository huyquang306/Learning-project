<?php

namespace App\Repositories;

use App\Models\MMenuCategory;

class CategoryRepository
{
    /**
     * Get category list of shop
     *
     * @param $shop_id
     * @param $tier_number
     * @param $parent_id
     * @return mixed
     */
    public function getCategories($shop_id, $tier_number, $parent_id)
    {
        $query = MMenuCategory::where('m_shop_id', $shop_id)
            ->where('tier_number', $tier_number)
            ->with('childCategories');
        if ($parent_id) {
            $query->where('parent_id', $parent_id);
        }

        return $query->get();
    }

    /**
     * Get category list of shop that registered menu
     *
     * @param $shopId
     * @param $tierNumber
     * @param $parentId
     * @return mixed
     */
    public function getRegisteredMenuCategories($shopId, $tierNumber, $parentId)
    {
        $query = MMenuCategory::query();
        // Query data
        $query->join('r_shop_menu', 'm_menu_category.m_shop_id', '=', 'r_shop_menu.m_shop_id')
            ->join('r_menu_category', function ($join) {
                $join->on('r_shop_menu.id', '=', 'r_menu_category.r_shop_menu_id')
                    ->on('m_menu_category.id', '=', 'r_menu_category.m_menu_category_id');
            })
            ->where('m_menu_category.m_shop_id', $shopId)
            ->where('m_menu_category.tier_number', $tierNumber)
            ->where('r_shop_menu.deleted_at', '=', null)
            ->where('r_menu_category.deleted_at', '=', null)
            ->selectRaw(
                'm_menu_category.id'
            )
            ->groupBy('m_menu_category.id');

        if ($parentId) {
            $query->where('parent_id', $parentId);
        }

        return $query->get();
    }
}
