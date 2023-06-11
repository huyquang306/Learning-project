<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\ShopPosRequest;
use App\Http\Resources\Shop\MTaxResource;
use App\Http\Resources\Shop\ShopTaxResource;
use App\Models\MShop;
use App\Services\Shop\ShopPosService;
use App\Services\ShopService;
use Illuminate\Http\JsonResponse;

class ShopPosController extends BaseApiController
{
    protected $shopPosService;
    protected $shopService;

    public function __construct(
        ShopPosService $shopPosService,
        ShopService $shopService
    ) {
        $this->shopService = $shopService;
        $this->shopPosService = $shopPosService;
    }

    /**
     * Get shop tax info
     * @param MShop $shop
     *
     * @return JsonResponse
     */
    public function show(MShop $shop): JsonResponse
    {
        $tax = $this->shopPosService->getTaxInfo($shop);

        if ($tax) {
            return $this->responseApi(new ShopTaxResource($tax));
        }

        return $this->responseApi(collect([]));
    }

    /**
     * Update shop tax info
     * @param ShopPosRequest $request
     * @param MShop          $shop
     *
     * @return JsonResponse
     */
    public function update(ShopPosRequest $request, MShop $shop): JsonResponse
    {
        $this->shopService->generateShopTaxInfo($shop);
        $tax = $this->shopPosService->updateShopTax($shop, $request);

        return $this->responseApi(new ShopTaxResource($tax));
    }

    /**
     * Get shop tax options
     * @param MShop $shop
     *
     * @return JsonResponse
     */
    public function getTaxOptions(MShop $shop): JsonResponse
    {
        $taxOptions = $this->shopPosService->getTaxOptions($shop);

        return $this->responseApi(MTaxResource::collection($taxOptions));
    }
}
