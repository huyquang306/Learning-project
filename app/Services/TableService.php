<?php

namespace App\Services;

use App\Models\MShop;
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
        return $this->table_repository->getShopTablesWithTrashedOrderByCode($shop);
    }
}