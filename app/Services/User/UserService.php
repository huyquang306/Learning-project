<?php

namespace App\Services\User;

use App\Repositories\Interfaces\UserRepositoryInterface;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * List user by phone number
     *
     * @param array $attributes
     * @return \Illuminate\Support\Collection
     */
    public function listUserByPhoneNumber(array $attributes)
    {
        return $this->userRepository->listUserByPhoneNumber($attributes);
    }

    /**
     * Create user or get if user exist
     *
     * @param array $attributes
     * @return MUser|null
     */
    public function createOrGetUser(array $attributes): ?MUser
    {
        return $this->userRepository->createOrGetUser($attributes);
    }

    /**
     * User update
     *
     * @param $attributes : array
     * @param $hashId     : string
     * @return MUser|null
     */
    public function updateUser($attributes, $hashId): ?MUser
    {
        return $this->userRepository->updateUser($attributes, $hashId);
    }
}