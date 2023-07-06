<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\UserRequest;
use App\Http\Resources\BaseResourceCollection;
use App\Http\Resources\Shop\UserResource;
use App\Models\MShop;
use App\Models\MUser;
use App\Services\Shop\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends BaseApiController
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get list data of users
     * @param UserRequest $request
     * @return JsonResponse
     */
    public function index(UserRequest $request): JsonResponse
    {
        $nameCustomer = $request->name ?? '';
        $emailCustomer = $request->email ?? '';
        $phoneNumber = $request->phone_number ?? '';
        $results = $this->userService->getList($nameCustomer, $emailCustomer, $phoneNumber);
        return $this->responseApi(new BaseResourceCollection($results));
    }

    /**
     * Show detail user
     * @param MShop $shop
     * @param MUser $user
     * @return JsonResponse
     */
    public function show(MShop $shop, MUser $user): JsonResponse
    {
        return $this->responseApi(new UserResource($user));
    }
}
