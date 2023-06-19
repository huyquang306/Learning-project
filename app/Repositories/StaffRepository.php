<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\MStaff;
use App\Models\SAccount;
use App\Repositories\BaseRepository;
use App\Repositories\Interfaces\StaffRepositoryInterface;

class StaffRepository extends BaseRepository implements StaffRepositoryInterface
{

    public function getModel(): string
    {
        return MStaff::class;
    }

    public function getSAccountByFireBaseUid(string $uid)
    {
        return SAccount::where('firebase_uid', $uid)->first();
    }

    /**
     * Get list staff of a shop that has hash_id
     * @param MShop           $shop
     * @param string|integer  $perPage
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getListOfShop(MShop $shop, $perPage = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        // Check get all staffs
        if ($perPage === '*') {
            $perPage = null;
        }

        return $this->model->with('mShops')
            ->whereHas('mShops', function ($shopQuery) use ($shop) {
                $shopQuery->where('m_shop.id', $shop->id);
            })->whereNotNull('hash_id')
            ->paginate($perPage);
    }
}