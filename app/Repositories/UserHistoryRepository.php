<?php

namespace App\Repositories;

use App\Repositories\Interfaces\UserHistoryRepositoryInterface;
use App\Models\MShop;
use App\Models\MUser;
use App\Models\TOrderGroup;
use Carbon\Carbon;
use DB;

class UserHistoryRepository extends BaseRepository implements UserHistoryRepositoryInterface
{
    /**
     * get model
     * @return string
     */
    public function getModel(): string
    {
        return MUser::class;
    }

    /**
     * Get list of Users
     *
     * @param MShop $shop
     * @param array $dataFilter
     * @return \Illuminate\Support\Collection
     */
    public function getList($shop, $dataFilter)
    {
        // get param
        $phoneNumber = $dataFilter['phoneNumber'];
        $emailCustomer = $dataFilter['emailCustomer'];
        $nameCustomer = $dataFilter['nameCustomer'];
        $timeStart = null;
        $timeEnd = null;
        if (isset($dataFilter['timeStart']) && !empty($dataFilter['timeStart'])) {
            $timeStart = Carbon::createFromFormat('Y-m-d', $dataFilter['timeStart'])->setTime(00, 00, 00);
        }
        if (isset($dataFilter['timeEnd']) && !empty($dataFilter['timeEnd'])) {
            $timeEnd = Carbon::createFromFormat('Y-m-d', $dataFilter['timeEnd'])->setTime(23, 59, 59);
        }
        // Get shop id
        $shopId = $shop->id;
        // query from m_user table
        $query = MUser::query();
        // Query data
        $query->join('t_order', function ($join) {
            $join->on('m_user.id', '=', 't_order.m_user_id');
        })->join('t_ordergroup', function ($join) {
            $join->on('t_order.t_ordergroup_id', '=', 't_ordergroup.id');
        })
            ->when($phoneNumber, function ($query) use ($phoneNumber) {
                $query->where('m_user.phone_number', 'like', '%' . $phoneNumber . '%');
            })
            ->when($nameCustomer, function ($query) use ($nameCustomer) {
                $query->where('m_user.nick_name', 'like', '%' . $nameCustomer . '%');
            })
            ->when($emailCustomer, function ($query) use ($emailCustomer) {
                $query->where('m_user.email', 'like', '%' . $emailCustomer . '%');
            })
            ->when($timeStart, function ($query) use ($timeStart) {
                $query->where('t_ordergroup.created_at', '>=', $timeStart);
            })
            ->when($timeEnd, function ($query) use ($timeEnd) {
                $query->where('t_ordergroup.created_at', '<=', $timeEnd);
            })
            ->where('t_ordergroup.m_shop_id', $shopId)
            ->selectRaw(
                'm_user.hash_id,
                m_user.nick_name,
                m_user.email,
                m_user.family_name,
                m_user.given_name,
                m_user.phone_number,
                m_user.birth_date,
                m_user.prefecture,
                m_user.city,
                m_user.address,
                m_user.building,
                count(distinct t_ordergroup.id) as times_order,
                max(t_ordergroup.created_at) as last_check_out'
            )
            ->groupBy('m_user.hash_id')
            ->orderBy('m_user.id', 'ASC');

        return $query->paginate(config('const.pagination.USERS_PAGINATION'));
    }

    /**
     * Show detal user history
     *
     * @param array $dataFilter
     * @param MShop $shop
     * @param MUser $user
     * @return \Illuminate\Support\Collection
     */
    public function showDetail($dataFilter, $shop, $user)
    {
        $timeStart = null;
        $timeEnd = null;
        if (!empty($dataFilter['timeStart'])) {
            $timeStart = Carbon::createFromFormat('Y-m-d', $dataFilter['timeStart'])->setTime(00, 00, 00);
        }
        if (!empty($dataFilter['timeEnd'])) {
            $timeEnd = Carbon::createFromFormat('Y-m-d', $dataFilter['timeEnd'])->setTime(23, 59, 59);
        }
        // Get shop id
        $shopId = $shop->id;
        // Get user id
        $userId = $user->id;
        //
        $query = TOrderGroup::query();
        // Query data by shop id and user id
        $query->join('t_order', function ($join) {
            $join->on('t_order.t_ordergroup_id', '=', 't_ordergroup.id');
        })->leftJoin('r_shop_menu', function ($join) {
            $join->on('t_order.r_shop_menu_id', '=', 'r_shop_menu.id');
        })->leftJoin('m_menu', function ($join) {
            $join->on('r_shop_menu.m_menu_id', '=', 'm_menu.id');
        })->leftJoin('r_shop_course', function ($join) {
            $join->on('t_order.r_shop_course_id', '=', 'r_shop_course.id');
        })->leftJoin('m_course', function ($join) {
            $join->on('r_shop_course.m_course_id', '=', 'm_course.id');
        })
            ->where('t_ordergroup.m_shop_id', $shopId)
            ->where('t_order.m_user_id', $userId)
            ->when($timeStart, function ($query) use ($timeStart) {
                $query->where('t_ordergroup.created_at', '>=', $timeStart);
            })
            ->when($timeEnd, function ($query) use ($timeEnd) {
                $query->where('t_ordergroup.created_at', '<=', $timeEnd);
            })
            ->select(
                't_ordergroup.hash_id',
                't_ordergroup.total_billing',
                't_ordergroup.number_of_customers',
                't_ordergroup.created_at as start_time',
                'm_menu.name as menu_name',
                'm_course.name as course_name',
                't_order.r_shop_menu_id',
                't_order.price_unit',
                't_order.quantity',
                't_order.amount',
                't_order.status',
                't_order.ordered_at',
                't_order.updated_at'
            )->orderBy('t_ordergroup.created_at', 'DESC');

        return $query->get();
    }
}
