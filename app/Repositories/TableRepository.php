<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\MTable;
use App\Models\MTableDefault;

class TableRepository extends BaseRepository
{

    public function getModel(): string
    {
        return MTable::class;
    }

    /**
     * Create default tables for shop
     *
     * @param MShop $shop
     * @return void
     */
    public function createDefaultTablesForShop(MShop $shop)
    {
        $defaultTables = MTableDefault::all();
        foreach ($defaultTables as $defaultTable) {
            $data = [
                'hash_id' => $this->makeHashId(),
                'm_shop_id' => $shop->id,
                'code' => $defaultTable->code,
                'status' => MTable::STATUS_TRUE,
            ];
            $this->model->create($data);
        }
    }

    /**
     * Get all shop's tables ordered by code
     *
     * @param MShop $shop
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getShopTablesOrderByCode(MShop $shop): ?\Illuminate\Database\Eloquent\Collection
    {
        return $shop->mTables()
            ->orderBy('code', 'ASC')
            ->get() ? : null;
    }

    /**
     * Get all shop's tables with deleted ordered by code
     *
     * @param MShop $shop
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getShopTablesWithTrashedOrderByCode(MShop $shop): ?\Illuminate\Database\Eloquent\Collection
    {
        return $shop->mTablesWithTrashed()
            ->orderBy('code', 'ASC')
            ->withTrashed()
            ->get() ? : null;
    }
}
