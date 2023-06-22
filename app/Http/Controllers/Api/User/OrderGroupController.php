<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\OrderGroupResource;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Services\User\OrderGroupService;
use App\Services\User\PrinterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderGroupController extends BaseApiController
{
    protected $orderGroupService;
    protected $printerService;

    public function __construct(
        OrderGroupService $orderGroupService,
        PrinterService $printerService
    ) {
        $this->orderGroupService = $orderGroupService;
        $this->printerService = $printerService;
    }

    /**
     * Get info of order group
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return JsonResponse
     */
    public function show(MShop $shop, TOrderGroup $ordergroup): JsonResponse
    {
        return $this->responseApi(new OrderGroupResource($this->orderGroupService->getOrderGroup($ordergroup)));
    }
}
