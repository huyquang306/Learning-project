<?php

namespace App\Services\Shop;

use App\Repositories\Interfaces\UserHistoryRepositoryInterface;
use Carbon\Carbon;

class UserHistoryService
{
    /**
     * @var UserHistoryRepositoryInterface
     */
    protected $userHistoryRepository;

    public function __construct(UserHistoryRepositoryInterface $userHistoryRepository)
    {
        $this->userHistoryRepository = $userHistoryRepository;
    }

    /**
     * List User
     *
     * @param MShop $shop
     * @param array $dataFilter
     *
     * @return Collection
     */
    public function getList($shop, $dataFilter)
    {
        return $this->userHistoryRepository->getList($shop, $dataFilter);
    }

    /**
     * Show detal user history
     *
     * @param array $dataFilter
     * @param MShop $shop
     * @param MUser $user
     * @return Collection
     */
    public function showDetail($dataFilter, $shop, $user)
    {
        $userDetails = $this->userHistoryRepository->showDetail($dataFilter, $shop, $user);
        $userDetailHistories = [];

        foreach ($userDetails as $userDetail) {
            $hashId = $userDetail->hash_id;

            if (array_key_exists($hashId, $userDetailHistories)) {
                $userDetailHistoryMenu = [
                    'name' => $userDetail->r_shop_menu_id ? $userDetail->menu_name : $userDetail->course_name,
                    'price_unit' => $userDetail->price_unit,
                    'quantity' => $userDetail->quantity,
                    'amount' => $userDetail->amount,
                    'status' => $userDetail->status,
                    'ordered_at' => Carbon::parse($userDetail->ordered_at)->format('Y/m/d H:i'),
                    'updated_at' => Carbon::parse($userDetail->updated_at)->format('Y/m/d H:i'),
                ];
                array_push($userDetailHistories[$hashId]['menus'], $userDetailHistoryMenu);
            } else {
                $userDetailHistories[$hashId] = [
                    'hash_id' => $userDetail->hash_id,
                    'total_billing' => $userDetail->total_billing,
                    'number_of_customers' => $userDetail->number_of_customers,
                    'start_time' => getDateTime(strtotime($userDetail->start_time)),
                    'menus' => [
                        [
                            'name' => $userDetail->r_shop_menu_id ? $userDetail->menu_name : $userDetail->course_name,
                            'price_unit' => $userDetail->price_unit,
                            'quantity' => $userDetail->quantity,
                            'amount' => $userDetail->amount,
                            'status' => $userDetail->status,
                            'ordered_at' => Carbon::parse($userDetail->ordered_at)->format('Y/m/d H:i'),
                            'updated_at' => Carbon::parse($userDetail->updated_at)->format('Y/m/d H:i'),
                        ]
                    ],
                ];
            }
        }

        return array_values($userDetailHistories);
    }
}
