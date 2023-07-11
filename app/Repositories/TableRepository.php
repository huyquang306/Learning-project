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

    /**
     * @param string $field_name
     * @param string $value
     * @return bool
     */
    public function tableDuplicateCheck(string $field_name, string $value): bool
    {
        return !MTable::where($field_name, $value)->count();
    }

    /**
     * Create table
     *
     * @param $data
     * @param MShop $shop
     * @return MTable|null
     */
    public function createTable($data, MShop $shop): ?MTable
    {
        $table_id = null;

        \DB::transaction(
            function() use ($shop, $data, &$table_id) {
                $table = new MTable();
                $table->m_shop_id = $shop->id;
                $table->hash_id = $data['hash_id'];
                $table->code = $data['code'];
                $table->status = true;
                $table->save();
                $table_id = $table->id;
            }
        );

        if ($table_id) {
            return MTable::find($table_id);
        }

        return null;
    }

    /**
     * Update table
     *
     * @param $data
     * @param MShop $shop
     * @param MTable $table
     * @return MTable|null
     */
    public function updateTable($data, MShop $shop, MTable $table): ?MTable
    {
        if($table) {
            \DB::transaction(function() use ($data, $shop, $table) {
                $table->fill($data);
                $table->m_shop_id = $shop->id;
                $table->save();
            });

            return $table;
        }

        return null;
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
        // Status that can not delete table
        $statuses = [
            config('const.STATUS_ORDERGROUP.PRE_ORDER'),
            config('const.STATUS_ORDERGROUP.ORDERING'),
            config('const.STATUS_ORDERGROUP.REQUEST_CHECKOUT'),
            config('const.STATUS_ORDERGROUP.WAITING_CHECKOUT'),
        ];

        $table->load([
            'tOrdergroups' => function ($query) use ($statuses) {
                $query->whereIn('status', $statuses);
            },
        ]);
        \Log::info($table);

        if (count($table->tOrdergroups)) {
            return false;
        }

        \DB::transaction(function () use ($table) {
            $table->status = false;
            $table->save();
            $table->delete();
        });

        return true;
    }
}
