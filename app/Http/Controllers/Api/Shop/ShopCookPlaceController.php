<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\ShopCookPlaceRequest;
use App\Http\Resources\Shop\CookPlaceResource;
use App\Models\MShop;
use App\Models\MShopCookPlace;
use App\Services\Shop\CookPlaceService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShopCookPlaceController extends BaseApiController
{
    protected $cookPlaceService;

    public function __construct(CookPlaceService $cookPlaceService)
    {
        $this->cookPlaceService = $cookPlaceService;
    }

    /**
     * Get list data of cook_places
     * @param MShop $shop
     *
     * @return JsonResponse
     */
    public function index(MShop $shop): JsonResponse
    {
        $results = $this->cookPlaceService->getListOfShop($shop);

        return $this->responseApi(CookPlaceResource::collection($results));
    }

    /**
     * Store a new cook_place
     * @param ShopCookPlaceRequest $request
     * @param MShop                $shop
     *
     * @return JsonResponse
     */
    public function store(ShopCookPlaceRequest $request, MShop $shop): JsonResponse
    {
        $newCookPlace = $this->cookPlaceService->create($request, $shop);

        return $this->responseApi(new CookPlaceResource($newCookPlace));
    }

    /**
     * Update a cook_place
     * @param ShopCookPlaceRequest $request
     * @param MShop                $shop
     * @param MShopCookPlace       $cookPlace
     *
     * @return JsonResponse
     */
    public function update(ShopCookPlaceRequest $request, MShop $shop, MShopCookPlace $cookPlace): JsonResponse
    {
        $cookPlace = $this->cookPlaceService->update($request, $cookPlace);

        return $this->responseApi(new CookPlaceResource($cookPlace));
    }

    /**
     * Delete a cook_place
     * @param MShop          $shop
     * @param MShopCookPlace $cookPlace
     *
     * @return JsonResponse
     */
    public function destroy(MShop $shop, MShopCookPlace $cookPlace): JsonResponse
    {
        $result = $this->cookPlaceService->delete($cookPlace);

        return $this->responseApi($result);
    }
}
