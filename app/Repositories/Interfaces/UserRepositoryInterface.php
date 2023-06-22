<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * @param object $passby(m_shop_id, [user_id])
     * @return mixed
     */
    public function savePassby($passby);

    /**
     * @param object $watch(m_shop_id, [user_id], [item_id])
     * @return mixed
     */
    public function saveWatch($watch);

    /**
     * @param integer $m_user_id
     * @return mixed
     */
    public function getTakeoutReserve($m_user_id);

    /**
     * @param string $m_shop_id
     * @param string $m_item_id
     * @param integer $m_user_id
     * @param int $quantity
     *
     * @return mixed
     */
    public function createTakeoutReserve(int $m_user_id, string $shop_id, string $item_id, int $quantity);

    /**
     * @param integer $id
     * @return mixed
     */
    public function deleteTakeoutReserve(int $id);

    /**
     * Get menu list of shop
     *
     * @param MShop $shop
     * @return mixed
     */
    public function getMenus(MShop $shop);

    /**
     * Get list of Users
     *
     * @param string $nameCustomer  : string
     * @param string $emailCustomer : string
     * @param string $phoneNumber   : string
     * @return \Illuminate\Support\Collection
     */
    public function getList($nameCustomer, $emailCustomer, $phoneNumber);

    /**
     * Update user information
     *
     * @param $attributes : array
     * @param $hashId     : string
     * @return MUser|null
     */
    public function updateUser($attributes, $hashId);

    /**
     * Create user or get if user exist
     *
     * @param array $attributes
     * @return MUser|null
     */
    public function createOrGetUser(array $attributes);

    /**
     * List user by phone number
     *
     * @param array $attributes
     * @return \Illuminate\Support\Collection
     */
    public function listUserByPhoneNumber(array $attributes);
}