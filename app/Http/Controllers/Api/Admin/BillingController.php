<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ServiceBillingsResource;
use App\Models\MShop;
use App\Services\Admin\TServiceBillingService;
use Illuminate\Http\Request;

class BillingController extends BaseApiController
{
    protected $tServiceBillingService;

    public function __construct(TServiceBillingService $tServiceBillingService)
    {
        $this->tServiceBillingService = $tServiceBillingService;
    }

    public function index(MShop $shop): \Illuminate\Http\JsonResponse
    {
        $billings = $this->tServiceBillingService->getShopBillingsPagination($shop);

        return $this->responseApi(new ServiceBillingsResource($billings));
    }
}
