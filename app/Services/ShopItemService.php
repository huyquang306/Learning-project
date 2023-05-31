<?php

namespace App\Services;

use App\Models\MShop;
use App\Repositories\ShopRepository;

class ShopItemService
{
    protected $shop_repository;

    public function __construct(ShopRepository $shop_repository)
    {
        $this->shop_repository = $shop_repository;
    }

    /**
     * @param $request
     * @param MShop $shop
     * @return mixed
     */
    public function createItem($request, MShop $shop)
    {
        $m_item = $this->shop_repository->createItem($shop, $request->name, $request->price);

        while (true) {
            $hash_id = makeHash();
            if ($this->shop_repository->itemDuplicateCheck('hash_id', $hash_id)) {
                break;
            }
        }

        $request->merge(
            array(
                'hash_id' => $hash_id
            )
        );

        return self::updateItem($request, $shop->id, $m_item->id);
    }

    /**
     * @param $request
     * @param $shop_id
     * @param $item_id
     * @return mixed|null
     */
    public function updateItem($request, $shop_id, $item_id)
    {
        return $this->shop_repository->updateItem($request, $shop_id, $item_id);
    }

    /**
     * @param int $m_shop_id
     * @param int $m_item_id
     * @return bool|null
     */
    public function deleteItem(int $m_shop_id, int $m_item_id): ?bool
    {
        return $this->shop_repository->deleteItem($m_shop_id, $m_item_id);
    }
}
