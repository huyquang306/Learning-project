<?php

namespace App\Services\Shop;

use App\Repositories\Interfaces\UserRepositoryInterface;

class UserService
{
    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * List User
     *
     * @param string $nameCustomer  : string
     * @param string $emailCustomer : string
     * @param string $phoneNumber   : string
     * @return mixed
     */

    public function getList($nameCustomer, $emailCustomer, $phoneNumber)
    {
        return $this->userRepository->getList($nameCustomer, $emailCustomer, $phoneNumber);
    }
}
