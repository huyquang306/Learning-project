<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Resources\BaseResourceCollection;
use App\Models\MShop;
use App\Models\MUser;
use App\Services\Shop\UserHistoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserHistoryController extends BaseApiController
{
    protected $userHistoryService;

    public function __construct(UserHistoryService $userHistoryService)
    {
        $this->userHistoryService = $userHistoryService;
    }

    /**
     * Get list data of history users
     * @param Request $request
     * @param MShop   $shop
     * @return JsonResponse
     */
    public function index(Request $request, MShop $shop): JsonResponse
    {
        $dataFilter['nameCustomer'] = $request->nick_name ?? '';
        $dataFilter['phoneNumber'] = $request->phone_number ?? '';
        $dataFilter['emailCustomer'] = $request->email ?? '';
        $dataFilter['timeStart'] = $request->timeStart ?? '';
        $dataFilter['timeEnd'] = $request->timeEnd ?? '';
        $results = $this->userHistoryService->getList($shop, $dataFilter);

        return $this->responseApi(new BaseResourceCollection($results));
    }

    /**
     * Show detail user history
     *
     * @param Request $request
     * @param MShop   $shop
     * @param MUser   $user
     * @return JsonResponse
     */
    public function show(Request $request, MShop $shop, MUser $user): JsonResponse
    {
        $dataFilter['timeStart'] = $request->timeStart ?? '';
        $dataFilter['timeEnd'] = $request->timeEnd ?? '';
        $userHistory = $this->userHistoryService->showDetail($dataFilter, $shop, $user);

        return $this->responseApi($userHistory);
    }
}
