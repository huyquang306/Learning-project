<?php

namespace App\Repositories;

use App\Models\TTmpShop;
use App\Repositories\Interfaces\TmpShopRepositoryInterface;
use Carbon\Carbon;

class TmpShopRepository extends BaseRepository implements TmpShopRepositoryInterface
{

    public function getModel(): string
    {
        return TTmpShop::class;
    }

    /**
     * Save a new tmp shop type register
     *
     * @param array $shopInfo
     * @param int $type
     * @return TTmpShop
     */
    public function save(array $shopInfo, int $type = TTmpShop::REGISTER_SHOP_TYPE): TTmpShop
    {
        $expiredTime = now();
        if ($type == TTmpShop::REGISTER_SHOP_TYPE || $type == TTmpShop::COPY_DEACTIVATE_SHOP_TYPE) {
            $expiredTime = now()->addMinutes(config('const.shop.expired_time.register_shop'));
        } else if ($type == TTmpShop::FORGOT_PASSWORD_TYPE) {
            $expiredTime = now()->addMinutes(config('const.shop.expired_time.forgot_password'));
        }

        $tmpShopData = [
            'hash_id' => $this->makeHashId(),
            'type' => $type,
            'email' => $shopInfo['email'],
            'shop_info' => collect($shopInfo),
            'expired_time' => $expiredTime,
        ];

        return $this->create($tmpShopData);
    }

    /**
     * Check code existed and hasn't expired
     *
     * @param string $hashId
     * @return bool
     */
    public function validCode(string $hashId): bool
    {
        return $this->model->where('hash_id', $hashId)
            ->where('expired_time', '>=', Carbon::now())
            ->exists();
    }

    /**
     * Find tmp shop by hashId and type
     *
     * @param string $hashId
     * @param int    $type
     * @return TTmpShop|null
     */
    public function findByHashAndType(string $hashId, int $type): ?TTmpShop
    {
        return $this->model->where('hash_id', $hashId)
            ->where('type', $type)
            ->first();
    }

    /**
     * Find tmp shop by hashId
     *
     * @param string $hashId
     * @return TTmpShop|null
     */
    public function findByHashId(string $hashId): ?TTmpShop
    {
        return $this->model->where('hash_id', $hashId)
            ->first();
    }

    /**
     * Find tmp shop by hashId
     *
     * @param string $email
     * @return TTmpShop|null
     */
    public function findByEmail(string $email): ?TTmpShop
    {
       return $this->model->where('email', $email)
           ->first();
    }
}
