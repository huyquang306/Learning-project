<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserRequest;
use App\Http\Resources\Shop\UserResource;
use App\Models\MUser;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends BaseApiController
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * List user by phone number
     *
     * @param UserRequest $request
     * @return JsonResponse
     */
    public function listUserByPhoneNumber(UserRequest $request): JsonResponse
    {
        $attributes = $request->only([
            'phone_number',
        ]);
        $users = $this->userService->listUserByPhoneNumber($attributes);

        return $this->responseApi(UserResource::collection($users));
    }

    /**
     * Create user or get if user exist
     *
     * @param UserRequest $request
     * @return JsonResponse
     */
    public function create(UserRequest $request): JsonResponse
    {
        $attributes = $request->only([
            'nick_name',
            'phone_number',
        ]);
        $user = $this->userService->createOrGetUser($attributes);

        return $this->responseApi(new UserResource($user));
    }

    /**
     * Show detail user
     *
     * @param MUser $user
     * @return JsonResponse
     */
    public function show(MUser $user): JsonResponse
    {
        if (!$user->hash_id) {
            $user = Auth::user();
        }
        if ($user) {
            return $this->responseApi(new UserResource($user));
        }

        return $this->responseApi(null);
    }

    /**
     * User update
     *
     * @param UserRequest $request
     * @param MUser       $user
     * @return JsonResponse
     */
    public function update(UserRequest $request, MUser $user): JsonResponse
    {
        $attributes = $request->only([
            'nick_name',
            'email',
            'family_name',
            'given_name',
            'family_name_kana',
            'given_name_kana',
            'phone_number',
            'birth_date',
            'prefecture',
            'city',
            'address',
            'building',
        ]);
        $hashId = $user->hash_id;
        $user = $this->userService->updateUser($attributes, $hashId);

        return $this->responseApi(new UserResource($user));
    }
}
