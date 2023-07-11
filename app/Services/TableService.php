<?php

namespace App\Services;

use App\Http\Requests\Shop\TableRequest;
use App\Models\MShop;
use App\Models\MTable;
use App\Repositories\TableRepository;

class TableService
{
    protected $tableRepository;

    public function __construct(TableRepository $tableRepository)
    {
        $this->tableRepository = $tableRepository;
    }

    /**
     * Get all shop's tables ordered by code
     *
     * @param MShop $shop
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getShopTablesOrderByCode(MShop $shop): ?\Illuminate\Database\Eloquent\Collection
    {
        return $this->tableRepository->getShopTablesOrderByCode($shop);
    }

    /**
     * Get all shop's tables with deleted ordered by code
     *
     * @param MShop $shop
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getShopTablesWithTrashedOrderByCode(MShop $shop): ?\Illuminate\Database\Eloquent\Collection
    {
        return $this->tableRepository->getShopTablesWithTrashedOrderByCode($shop);
    }

    /**
     * Create table
     *
     * @param TableRequest $request
     * @param MShop $shop
     *
     * @return MTable|null
     */
    public function createTable(TableRequest $request, MShop $shop): ?\App\Models\MTable
    {
        while (true) {
            $hash_id = makeHash();
            if ($this->tableRepository->tableDuplicateCheck('hash_id', $hash_id)) {
                break;
            }
        }
        $request->merge(
            array(
                'hash_id' => $hash_id
            )
        );
        $data = $request->all();

        return $this->tableRepository->createTable($data, $shop);
    }

    /**
     * Update table
     *
     * @param TableRequest $request
     * @param MShop $shop
     * @param MTable $table
     *
     * @return MTable|null
     */
    public function updateTable(TableRequest $request, MShop $shop, MTable $table): ?MTable
    {
        $data = $request->all();

        return $this->tableRepository->updateTable($data, $shop, $table);
    }

    /**
     * Delete table
     *
     * @param MShop $shop
     * @param MTable $table
     *
     * @return bool
     */
    public function deleteTable(MShop $shop, MTable $table): bool
    {
        return $this->tableRepository->deleteTable($shop, $table);
    }

}