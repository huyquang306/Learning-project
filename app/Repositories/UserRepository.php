<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\MUser;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{

    public function getModel()
    {
        return MUser::class;
    }

    public function savePassby($passby)
    {
        // TODO: Implement savePassby() method.
    }

    public function saveWatch($watch)
    {
        // TODO: Implement saveWatch() method.
    }

    public function getTakeoutReserve($m_user_id)
    {
        // TODO: Implement getTakeoutReserve() method.
    }

    public function createTakeoutReserve(int $m_user_id, string $shop_id, string $item_id, int $quantity)
    {
        // TODO: Implement createTakeoutReserve() method.
    }

    public function deleteTakeoutReserve(int $id)
    {
        // TODO: Implement deleteTakeoutReserve() method.
    }

    public function getMenus(MShop $shop)
    {
        // TODO: Implement getMenus() method.
    }

    public function getList($nameCustomer, $emailCustomer, $phoneNumber)
    {
        // TODO: Implement getList() method.
    }

    /**
     * Update user information
     *
     * @param $attributes : array
     * @param $hashId     : string
     * @return MUser|null
     */
    public function updateUser($attributes, $hashId): ?MUser
    {
        //fill user by hashId
        $m_user = MUser::where('hash_id', $hashId)->first();
        $m_user->fill($attributes)->save();

        return $m_user;
    }

    /**
     * Create user or get if user exist
     *
     * @param array $attributes
     * @return MUser|null
     */
    public function createOrGetUser(array $attributes): ?MUser
    {
        // check if phone_number and nick_name existed
        $mUSer = MUser::where('phone_number', $attributes['phone_number'])
            ->where('nick_name', $attributes['nick_name'])
            ->first();

        if ($mUSer) {
            return $mUSer;
        }
        // create new user
        $newUser = new MUser();
        $hashId = $this->makeHashId();
        $newUser->fill(array_merge($attributes, ['hash_id' => $hashId]))->save();

        return $newUser;
    }

    public function listUserByPhoneNumber(array $attributes)
    {
        return MUser::where('phone_number', $attributes['phone_number'])->get();
    }
}