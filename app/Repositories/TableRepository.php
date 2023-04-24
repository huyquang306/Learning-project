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
}
