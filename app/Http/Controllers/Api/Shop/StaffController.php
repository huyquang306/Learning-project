<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Resources\BaseResourceCollection;
use App\Models\MShop;
use App\Services\Shop\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends BaseApiController
{
    protected $staffService;

    public function __construct(StaffService $staffService)
    {
        $this->staffService = $staffService;
    }

    /**
     * Get list staffs of shop
     * @param Request $request
     * @param MShop   $shop
     *
     * @return JsonResponse
     */
    public function index(Request $request, MShop $shop): JsonResponse
    {
        $results = $this->staffService->getListOfShop($request, $shop);

        return $this->responseApi(new BaseResourceCollection($results));
    }
}
