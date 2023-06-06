<?php

namespace App\Repositories;

use App\Models\MShopMeta;
use App\Repositories\Interfaces\ShopMetaRepositoryInterface;

class ShopMetaRepository extends BaseRepository implements ShopMetaRepositoryInterface
{

    public function getModel(): string
    {
        return MShopMeta::class;
    }

    /**
     * Get value by type, shop
     *
     * @param integer $shopId
     * @param string  $type
     *
     * @return \Illuminate\Support\Collection
     */
    public function getShopMetaByKey($shopId, $type)
    {
        $record = $this->model->where('m_shop_id', $shopId)
            ->where('type', $type)->first();

        return $record ? json_decode($record->value) : null;
    }

    /**
     * Update Value by type, shop
     *
     * @param integer $shopId
     * @param string  $type
     * @param object  $data
     *
     * @return \Illuminate\Support\Collection
     */
    public function updateShopMetaByKey($shopId, $type, $data)
    {
        return $this->model->updateOrCreate(
            [
                'm_shop_id' => $shopId,
                'type' => $type,
            ],
            [
                'm_shop_id' => $shopId,
                'type' => $type,
                'value' => json_encode($data),
            ]
        );
    }
}