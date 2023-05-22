<?php

namespace App\Http\Controllers\Api\Shop;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseApiController;
use App\Models\MShop;
use App\Services\TableService;

class TableController extends BaseApiController
{
    protected $tableService;

    public function __construct(
        TableService $tableService
    ) {
        $this->tableService = $tableService;
    }

    /**
     * Get list table
     *
     * @param MShop $shop
     * @param Request $request
     * @return array
     */
    public function index(MShop $shop, Request $request): array
    {
        $withDeleted = $request->input('with-deleted', false);
        if ($withDeleted) {
            return [
                "status" => 'success',
                "message" => '',
                "data" => $this->tableService->getShopTablesWithTrashedOrderByCode($shop),
            ];
        }

        return [
            "status" => 'success',
            "message" => '',
            "data" => $this->tableService->getShopTablesOrderByCode($shop),
        ];
    }
}
