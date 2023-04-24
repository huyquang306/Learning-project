<?php

namespace App\Repositories\Interfaces;

use App\Models\TTmpShop;

interface TmpShopRepositoryInterface extends BaseRepositoryInterface
{
    public function save(array $shopInfo, int $type = TTmpShop::REGISTER_SHOP_TYPE);

    public function validCode(string $hashId);

    public function findByHashAndType(string $hashId, int $type);

    public function findByHashId(string $hashId);
}
