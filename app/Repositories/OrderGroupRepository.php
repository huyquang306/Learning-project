<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\MTable;
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

    /**
     * @param array $table_hash_ids
     * @param null $ordergroup_id
     * @return bool
     */
    public function checkTablesAvailable(array $table_hash_ids, $ordergroup_id = null): bool
    {
        $table_ids = MTable::whereIn('hash_id', $table_hash_ids)->get()->pluck('id')->toArray();
        $query = TOrderGroup::query();

        // check when update ordergroup
        if ($ordergroup_id) {
            $query->where('id', '<>', $ordergroup_id);
        }

        $query->whereIn('id', function ($query) use ($table_ids) {
            $query->select('t_ordergroup_id')
                ->from('r_table_ordergroup')
                ->where('m_table_id', $table_ids);
        });

        $query->whereIn('status', [
            config('const.STATUS_ORDERGROUP.PRE_ORDER'),
            config('const.STATUS_ORDERGROUP.ORDERING'),
            config('const.STATUS_ORDERGROUP.REQUEST_CHECKOUT'),
            config('const.STATUS_ORDERGROUP.WAITING_CHECKOUT'),
        ]);

        return !$query->exists();
    }

    /**
     * Store ordergroup information duplication check
     *
     * @param string $field_name
     * @param string $value
     * @return boolean
     */
    public function ordergroupDuplicateCheck(string $field_name, string $value): bool
    {
        return !TOrderGroup::where($field_name, $value)->count();
    }

    /**
     * Create ordergroup
     *
     * @param $data
     * @return mixed
     */
    public function createOrderGroupShop($data)
    {
        $m_table_id = $this->getIdMTable($data['add_hash_id']);
        $ordergroup = new TOrderGroup();
        $data['order_blocked'] = 1;
        $ordergroup->fill($data)->save();
        $ordergroup_id = $ordergroup->id ?? null;
        if ($m_table_id) {
            $ordergroup->mTables()->attach($m_table_id);
        }
        if ($ordergroup_id) {
            return TOrderGroup::with('mTables')->where('id', $ordergroup_id)->first();
        }

        return null;
    }

    /**
     * @param $hash_id
     * @return mixed
     */
    public function getIdMTable($hash_id)
    {
        if (is_array($hash_id)) {
            return MTable::whereIn('hash_id', $hash_id)->pluck('id');
        }

        return MTable::where('hash_id', $hash_id)->value('id');
    }

    /**
     * @param $hash_id
     * @return mixed
     */
    public function getTableCode($hash_id)
    {
        if (is_array($hash_id)) {
            return MTable::whereIn('hash_id', $hash_id)->pluck('code');
        }

        return MTable::where('hash_id', $hash_id)->value('code');
    }

    /**
     * @param $data_filter
     * @param MShop $shop
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getOrdergroups($data_filter, MShop $shop)
    {
        /**
         * use whereIn get ordergroup from table relations. not use WhereHas
         *
         * filter by table_ids
         * filter by status of order
         * filter by shop_id
         * filter time_start
         * filter time_end
         * paginate 20 items/page
         */

        $query = TOrderGroup::query();
        if (isset($data_filter['table_id']) && !empty($data_filter['table_id'])) {
            // convert table_ids to (int)
            $table_ids = explode(',', $data_filter['table_id']);
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
            $statuses = explode(',', $data_filter['status']);
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


        // filter time_start
        if (isset($data_filter['time_start']) && !empty($data_filter['time_start'])) {
            $time_start = Carbon::createFromFormat('Y-m-d', $data_filter['time_start'])->setTime(00, 00, 00);
            $query->where('created_at', '>=', $time_start);
        }

        // filter time_end
        if (isset($data_filter['time_end']) && !empty($data_filter['time_end'])) {
            $time_end = Carbon::createFromFormat('Y-m-d', $data_filter['time_end'])->setTime(23, 59, 59);
            $query->where('created_at', '<=', $time_end);
        }

        // filter shop ID
        $query->where('t_ordergroup.m_shop_id', $shop->id)->orderBy('t_ordergroup.id', 'DESC');

        // paginate
        if (isset($data_filter['limit']) && !empty($data_filter['limit'])) {
            return $query->paginate($data_filter['limit']);
        }

        return $query->paginate(config('const.pagination.ORDER_HISTORY_PAGINATION'));
    }
}
