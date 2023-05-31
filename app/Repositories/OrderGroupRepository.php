<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\TOrderGroup;

class OrderGroupRepository
{
    /**
     * @param $data_filter
     * @param MShop $shop
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getSummary($data_filter, MShop $shop)
    {
        $query = TOrderGroup::query();

        /**
         * use whereIn get ordergroup from table relations. not user WhereHas
         *
         * filter by table_ids
         * filter by category_id
         * filter by status of order
         * filter by shop_id
         * filter by status is ordering of ordergroup
         */

        // filter by tables
        if (isset($data_filter['table_id']) && !empty($data_filter['table_id'])) {
            // convert table_ids to (int)
            $table_ids = array_map('intval', explode(',', $data_filter['table_id']));
            $query->whereIn('t_ordergroup.id', function ($queryTable) use ($table_ids) {

                // get table from r_table_ordergroup with table_ids
                $queryTable
                    ->from('r_table_ordergroup')
                    ->select('t_ordergroup_id')
                    ->whereIn('r_table_ordergroup.m_table_id', $table_ids);
            });
        }

        // filter by status of orders
        if (isset($data_filter['status'])) {
            $statuses = array_map('intval', explode(',', $data_filter['status']));
            $query->with(
                $this->queryGetOrdersDataOfOrderGroup($statuses)
            );
        }

        // filter by categories
        if (isset($data_filter['category_id']) && !empty($data_filter['category_id'])) {
            // convert category_ids from string to (int)
            $categories = array_map('intval', explode(',', $data_filter['category_id']));

            // filter orderGroup with query whereIn
            $query->whereIn('t_ordergroup.id', function ($queryOrder) use ($categories) {

                // get ordergroup from order
                $queryOrder->from('t_order')
                    ->select('t_ordergroup_id')
                    ->join('r_shop_menu', 'r_shop_menu.id', '=', 't_order.r_shop_menu_id')

                    // join with r_shop_menu
                    ->whereIn('r_shop_menu_id', function ($queryShopMenu) use ($categories) {

                        // join with r_menu_category and get r_shop_menu_id
                        $queryShopMenu->from('r_shop_menu')
                            ->select('r_shop_menu.id')
                            ->join('r_menu_category', 'r_shop_menu.id', '=', 'r_menu_category.r_shop_menu_id')
                            // filter categories ID and get r_shop_menu.id
                            ->whereIn('m_menu_category_id', $categories);
                    });
            });
        }

        return $query
            // filter by shop_id
            ->where('t_ordergroup.m_shop_id', $shop->id)
            // filter status is Ordering
            ->whereIn('status', [
                config('const.STATUS_ORDERGROUP.PRE_ORDER'),
                config('const.STATUS_ORDERGROUP.ORDERING'),
                config('const.STATUS_ORDERGROUP.REQUEST_CHECKOUT'),
                config('const.STATUS_ORDERGROUP.WAITING_CHECKOUT'),
            ])->get();
    }

    /**
     * @param array $statuses
     * @return array
     */
    public function queryGetOrdersDataOfOrderGroup(array $statuses = []): array
    {
        return [
            'tOrders' => function ($query) use ($statuses) {
                if (count($statuses)) {
                    $query->whereIn('t_order.status', $statuses);
                }
                $query->with('mStaffs')
                    ->with([
                        'rShopMenu' => function ($rShopMenuQuery) {
                            $rShopMenuQuery->withTrashed()
                                ->with([
                                    'mMenuCategory.childCategories.childCategories',
                                ])->with([
                                    'mMenu' => function ($mMenuQuery) {
                                        $mMenuQuery->withTrashed()
                                            ->with([
                                                'mTax',
                                                'menuCookPlace',
                                                'mImages',
                                                'mainImage',
                                                'mBusinessHourPrices.mShopBusinessHour',
                                            ]);
                                    },
                                ]);
                        },
                        'rShopCourse' => function ($rShopCourseQuery) {
                            $rShopCourseQuery->withTrashed()
                                ->with([
                                    'mCourse' => function ($mCourseQuery) {
                                        $mCourseQuery->withTrashed()
                                            ->with([
                                                'rShopCourse.mCoursePrices.mTax',
                                                'childCourses.rShopCourse.mCoursePrices.mTax',
                                                'childCourses.childCourses',
                                                'mMenus.mImages',
                                                'mMenus.mainImage',
                                                'mMenus.mTax',
                                                'mMenus.mBusinessHourPrices.mShopBusinessHour',
                                            ])->with([
                                                'mMenus.rShopMenu.mMenuCategory' => function ($mMenuCategoryQuery) {
                                                    $mMenuCategoryQuery->orderBy('tier_number', 'DESC')
                                                        ->with('childCategories.childCategories');
                                                },
                                            ]);
                                    },
                                ]);
                        },
                    ]);
            },
        ];
    }

    /**
     * Get table of order groups
     *
     * @param $orderGroups
     * @return mixed
     */
    public function getTablesOfOrderGroups($orderGroups)
    {
        $orderGroups->load([
            'mTables' => function ($query) {
                $query->orderBy('code', 'ASC')->withTrashed();
            },
        ]);

        return $orderGroups;
    }
}
