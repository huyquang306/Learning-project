<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\Controller;
use App\Services\OrderGroupService;
use Illuminate\Http\Request;

class OrderGroupController extends Controller
{
    protected $orderGroupService;

    public function __construct(
        OrderGroupService $orderGroupService
    ){
        $this->orderGroupService = $orderGroupService;
    }

    /**
     * Get orderGroups summary
     *
     * @param Request $request
     * @param MShop $shop
     * @return Response
     */
    public function getSummary(Request $request, MShop $shop)
    {
        $orderGroups = $this->orderGroupService->getSummary($request, $shop);
        $orderGroups = $this->orderGroupService->getTablesOfOrderGroups($orderGroups);

        return response()->json([
            'status'  => 'success',
            'message' => 'message',
            'data'    => SummaryOrderGroupResource::collection($orderGroups),
        ]);
    }
}
