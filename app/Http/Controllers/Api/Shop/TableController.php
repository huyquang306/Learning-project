<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Requests\Shop\TableRequest;
use App\Models\MTable;
use App\Services\ImageService;
use App\Services\PrinterService;
use Illuminate\Http\Request;
use App\Http\Controllers\BaseApiController;
use App\Models\MShop;
use App\Services\TableService;

class TableController extends BaseApiController
{
    protected $tableService;
    protected $printerService;
    protected $imageService;

    public function __construct(
        TableService $tableService,
        PrinterService $printerService,
        ImageService $imageService
    ) {
        $this->tableService = $tableService;
        $this->printerService = $printerService;
        $this->imageService = $imageService;
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

    /**
     * Create table
     *
     * @param TableRequest $request
     * @param MShop $shop
     * @return array
     */
    public function create(TableRequest $request, MShop $shop): array
    {
        try {
            $response = $this->tableService->createTable($request, $shop);
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => []
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => []
            ];
        }

        return [
            'status' => 'success',
            'message' => '',
            'data' => $response
        ];
    }

    /**
     * Update table
     *
     * @param TableRequest $request
     * @param MShop $shop
     * @param MTable $table
     * @return array
     */
    public function update(TableRequest $request, MShop $shop, MTable $table): array
    {
        try {
            $response = $this->tableService->updateTable($request, $shop, $table);
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => []
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => []
            ];
        }

        return [
            'status' => 'success',
            'message' => '',
            'data' => $response
        ];
    }

    /**
     * Delete table
     *
     * @param MShop $shop
     * @param MTable $table
     * @return array
     */
    public function delete(MShop $shop, MTable $table): array
    {
        $response = $this->tableService->deleteTable($shop, $table);

        if ($response) {
            return [
                'status' => 'success',
                'message' => '',
                'data' => $table,
            ];
        }

        return [
            'status' => 'failure',
            'message' => '',
            'data' => $table,
        ];
    }
}
