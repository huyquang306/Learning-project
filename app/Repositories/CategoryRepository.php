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
     * Create menu category
     *
     * @param array $attributes
     * @return MMenuCategory|null
     */
    public function createCategory(array $attributes): ?MMenuCategory
    {
        return MMenuCategory::create($attributes);
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

    /**
     * Get menu category Detail
     *
     * @param $id
     * @return MMenuCategory|null
     */
    public function getCategoryDetail($id): ?MMenuCategory
    {
        return MMenuCategory::find($id);
    }

    /**
     * Check duplicate category code
     *
     * @param string $value
     * @return boolean
     */
    public function isCodeDuplicated(string $value): bool
    {
        return (bool)MMenuCategory::where('code', $value)->count();
    }

    /**
     * Update menu category
     *
     * @param array $attributes
     * @param $id
     * @return MMenuCategory|null
     */
    public function updateCategory(array $attributes, $id): ?MMenuCategory
    {
        $result = MMenuCategory::find($id)->update($attributes);
        if ($result) {
            return MMenuCategory::find($id);
        }

        return null;
    }

    /**
     * Delete menu category
     *
     * @param $id
     * @return boolean
     */
    public function deleteCategory($id): bool
    {
        return (bool)MMenuCategory::find($id)->delete();
    }
}
