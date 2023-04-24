<?php

namespace App\Repositories;

use App\Models\MGenre;
use App\Models\MShop;
use App\Models\MStaff;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ShopRepository extends BaseRepository
{

    public function getModel(): string
    {
        return MShop::class;
    }

    /**
     * Find Shop by User ID
     *
     * @param int $id
     * @return MShop|null
     */
    public function findShopByUser(int $id): ?MShop
    {
        return MStaff::find($id)->mShops()->get()
            ->load([
                'mItems',
                'mGenres',
            ]);
    }

    public function getShopData(MShop $shop): MShop
    {
        return $shop->load([
            'mItems',
            'mGenres',
        ]);
    }

    /**
     * Find shop by email
     *
     * @param string $email
     * @return MShop|null
     */
    public function findShopByEmail(string $email): ?MShop
    {
        return MShop::where('email', $email)->first();
    }

    /**
     * Find shop by hash id
     *
     * @param string $id
     * @return MShop|null
     */
    public function findShopsByHashId(string $id): ?MShop
    {
        return MShop::where('hash_id', $id)->where('opened', true)->first();
    }

    /**
     * Copy active Shop
     * @param MShop $shop
     *
     * @return MShop
     */
    public function saveActiveShop(MShop $shop): MShop
    {
        $shop->is_active = true;
        $shop->save();

        return $shop;
    }

    /**
     * Attach shop's staffs
     *
     * @param MShop $m_shop
     * @param array $m_staff_ids
     * @return boolean
     */
    public function attachUser(MShop $m_shop, array $m_staff_ids): bool
    {
        DB::transaction(
            function () use ($m_shop, $m_staff_ids) {
                foreach ((array) $m_shop->mStaffs()->get() as $value) {
                    // $m_shop->mStaffs()->get() return collection of MStaff
                    if ($value) {
                        $m_shop->mStaffs()->sync(
                            [$value->id => ['deleted_at' => Carbon::now('Asia/Bangkok')->format('Y-m-d H:i:s')]],
                            false
                        );
                    }
                }
                unset($value);

                foreach ((array) $m_staff_ids as $m_staff_id) {
                    $m_shop->mStaffs()->sync(
                        [$m_staff_id => ['deleted_at' => null]],
                        false
                    );
                }
                unset($m_staff_id);
            }
        );
        return true;
    }

    /**
     * Check duplicate shop data
     *
     * @param string $field_name
     * @param string $value
     * @return boolean
     */
    public function shopDuplicateCheck(string $field_name, string $value): bool
    {
        return !MShop::where($field_name, $value)->count();
    }

    /**
     * Get genre bt code
     *
     * @param int|null $code
     * @return MGenre|all|null
     */
    public function getGenre(int $code = null)
    {
        return $code ? MGenre::where('code', $code) : MGenre::all();
    }

    /**
     * Save shop's genre
     *
     * @param MShop $m_shop
     * @param array $genre_codes
     * @return MShop
     */
    public function saveGenre(MShop $m_shop, array $genre_codes): MShop
    {
        DB::transaction(
            function () use ($m_shop, $genre_codes) {
                foreach ($m_shop->mGenres()->get() as $value) {
                    if ($value) {
                        $m_shop->mGenres()->sync(
                            [$value->id => [
                                'deleted_at' => \Carbon\Carbon::now('Asia/Bangkok')->format('Y-m-d H:i:s')
                            ]],
                            false
                        );
                    }
                }
                unset($value);

                foreach (MGenre::whereIn('code', $genre_codes)->get() as $value) {
                    if ($value) {
                        $m_shop->mGenres()->sync(
                            [$value->id => ['deleted_at' => null]],
                            false
                        );
                    }
                }
                unset($value);
            }
        );
        return $m_shop;
    }
}
