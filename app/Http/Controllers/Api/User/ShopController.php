<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\ShopResource;
use App\Http\Resources\User\ShopTaxResource;
use App\Models\MShop;
use App\Services\User\ShopService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopController extends BaseApiController
{
    protected $shopService;

    /**
     * UserController constructor.
     * @param ShopService $shopService
     */
    public function __construct(ShopService $shopService)
    {
        $this->shopService = $shopService;
    }

    /**
     * Get info of shop
     *
     * @param MShop $shop
     * @return JsonResponse
     */
    public function show(MShop $shop): JsonResponse
    {
        return $this->responseApi(new ShopResource($shop));
    }

    /**
     * Get shop tax info
     * @param MShop $shop
     *
     * @return JsonResponse
     */
    public function getTaxInfo(MShop $shop): JsonResponse
    {
        $taxInfo = $this->shopService->getTaxInfo($shop);

        return $this->responseApi(new ShopTaxResource($taxInfo));
    }
}
