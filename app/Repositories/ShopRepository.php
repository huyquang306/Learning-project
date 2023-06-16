<?php

namespace App\Repositories;

use App\Models\MCountry;
use App\Models\MCurrency;
use App\Models\MGenre;
use App\Models\MItem;
use App\Models\MMenu;
use App\Models\MPaymentMethod;
use App\Models\MShop;
use App\Models\MShopPosSetting;
use App\Models\MStaff;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
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
     * @return Collection
     */
    public function findShopByUser(int $id): Collection
    {
        return MStaff::find($id)->mShops()->get()
            ->load([
                'mItems',
                'mGenres',
            ]);
    }

    public function getShopData(MShop $shop): MShop
    {
        $firstDayInMonth = now()->startOfMonth();
        $lastDayInMonth = now()->lastOfMonth();
        $startDayInMonth = config('const.PAYMENT.START_DAY_PAYMENT_IN_MONTH');
        if ($startDayInMonth) {
            $firstDayInMonth->setDay($startDayInMonth);
            $lastDayInMonth = $firstDayInMonth->copy()->addMonth()->subDay();
        }

        return $shop->load([
            'mItems',
            'mGenres',
            'mBusinessHours',
            'mShopMetas',
            'mCountry',
            'mShopPosSetting.mCurrency',
        ])->load([
            'tOrderGroups' => function ($orderGroupQuery) use ($firstDayInMonth, $lastDayInMonth) {
                $orderGroupQuery->whereDate('created_at', '>=', $firstDayInMonth)
                    ->whereDate('created_at', '<=', $lastDayInMonth)
                    ->withTrashed();
            },
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

    /**
     * @param MShop $shop
     * @param string $name
     * @param int $price
     *
     * @return mixed
     */
    public function createItem(MShop $shop, string $name, int $price)
    {
        $item_id = null;
        \DB::transaction(
            function () use ($shop, $name, $price, &$item_id) {
                $item = new MItem();
                $item->name = $name;
                $item->price = $price;
                $item->save();
                $item->mShops()->attach($shop->id);
                $item_id = $item->id;
            }
        );
        if ($item_id) {
            return MItem::find($item_id);
        }

        return null;
    }

    /**
     * @param string $field_name
     * @param string $value
     * @return bool
     */
    public function itemDuplicateCheck(string $field_name, string $value): bool
    {
        return !MItem::where($field_name, $value)->count();
    }

    /**
     * @param $request
     * @param string $shop_id
     * @param string $item_id
     * @return mixed
     */
    public function updateItem($request, string $shop_id, string $item_id)
    {
        $m_item = MItem::find($item_id);

        if ($m_item && $m_item->mShops()->find($shop_id)) {
            \DB::transaction(function () use ($request, $m_item) {
                $m_item->fill($request->all())->save();
            });
            return $m_item;
        }

        return null;
    }

    /**
     * @param string $shop_id
     * @param string $id
     * @param array $paths
     * @param string $type
     *
     * @return MMenu|MItem
     */
    public function updateImagePaths(string $shop_id, string $id, array $paths, string $type)
    {
        $m_shop = MShop::where('hash_id', $shop_id)->first();

        try {
            if ($type === 'item') {
                $col = $m_shop->mItems()->where('hash_id', $id)->first();
            } elseif ($type === 'menu') {
                $col = $m_shop->mMenus()->where('hash_id', $id)->first();
            } elseif ($type === 'course_menu') {
                $col = $m_shop->mCourses()->where('hash_id', $id)->first();
            }

            if ($col ?? false) {
                \DB::transaction(function () use ($paths, $col) {
                    $col->s_image_folder_path = $paths[0];
                    $col->m_image_folder_path = $paths[1];
                    $col->l_image_folder_path = $paths[2];
                    $col->save();
                });

                return $col;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @param string $m_shop_id
     * @param string $m_item_id
     * @return true|null
     */
    public function deleteItem(string $m_shop_id, string $m_item_id): ?bool
    {
        $m_item = MItem::find($m_item_id);

        if ($m_item && $m_item->mShops()->find($m_shop_id)) {
            \DB::transaction(function () use ($m_item) {
                $m_item->delete(); // soft delete
            });

            return true;
        }

        return null;
    }

    /**
     * Generate shop tax info
     *
     * @param MShop  $shop
     * @param string $countryCode
     * @return MShop
     */
    public function generateShopTaxInfo(MShop $shop, string $countryCode): MShop
    {
        $shop->load([
            'mShopPosSetting.mCurrency',
        ]);

        $country = MCountry::where('code', $countryCode)->first();
        if (!$country) {
            return $shop;
        }

        DB::beginTransaction();
        try {
            if (!$shop->m_country_id) {
                unset($shop->items);
                unset($shop->genres);
                $shop->m_country_id = $country->id;
                $shop->save();
            }

            // Check generate shop tax info
            if (!$shop->mShopPosSetting) {
                $mCurrency = MCurrency::where('m_country_id', $country->id)->first();
                /*
                $paymentMethod = MPaymentMethod::where('m_country_id', $country->id)
                    ->where('name', MPaymentMethod::CASH_NAME)
                    ->first();
                */
                if ($mCurrency) {
                    $shopPos = [
                        'm_currency_id' => $mCurrency->id,
                        'm_country_id' => $country->id,
                        'm_shop_id' => $shop->id,
                    ];
                    MShopPosSetting::create($shopPos);
                    /*
                    if ($paymentMethod) {
                        $shop->mPaymentMethods()->sync([
                            $paymentMethod->id => [
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]
                        ]);
                    }
                    */
                }
            }
            DB::commit();

            return $shop->refresh();
        } catch (\Exception $exception) {
            DB::rollBack();

            return $shop;
        }
    }

    /**
     * Update Shop Country is VN
     *
     * @param MShop $shop
     * @return MShop
     */
    public function updateShopCountryVN(MShop $shop): MShop
    {
        $countryCode = MShop::DEFAULT_COUNTRY_CODE;
        $country = MCountry::where('code', $countryCode)->first();
        if (!$country) {
            return $shop;
        }
        $shop->load('MShopPosSetting');

        if ($shop->m_country_id !== $country->id) {
            DB::beginTransaction();
            try {
                unset($shop->items);
                unset($shop->genres);
                $shop->m_country_id = $country->id;
                $shop->save();

                $mCurrency = MCurrency::where('m_country_id', $country->id)->first();
                if ($mCurrency) {
                    MShopPosSetting::updateOrCreate([
                        'id' => $shop->mShopPosSetting ? $shop->mShopPosSetting->id : null,
                    ], [
                        'm_currency_id' => $mCurrency->id,
                        'm_shop_id' => $shop->id,
                    ]);
                }

                /*
                $paymentMethod = MPaymentMethod::where('m_country_id', $country->id)
                    ->where('name', MPaymentMethod::CASH_NAME)
                    ->first();
                if ($paymentMethod) {
                    $shop->mPaymentMethods()->sync([
                        $paymentMethod->id => [
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    ]);
                }
                */
                DB::commit();

                return $shop->refresh();
            } catch (\Exception $exception) {
                DB::rollBack();
            }
        }

        return $shop;
    }

    /**
     * Update shop basic info
     *
     * @param ShopRequest $request
     * @return MShop|null
     */
    public function save($request): ?MShop
    {
        $m_shop = new MShop;

        if ($request->id) {
            $m_shop = MShop::find($request->id);
        } elseif ($request->hash_id) {
            $m_shop = MShop::where('hash_id', $request->hash_id)->first();
        }

        // Update overday_flg
        $startTime = Carbon::parse($request->start_time)->format('H:i:s');
        $endTime = Carbon::parse($request->end_time)->format('H:i:s');
        $request->merge([
            'overday_flg' => ($startTime > $endTime) ? $this->model::OVERDAY_FLAG_ON : $this->model::OVERDAY_FLAG_OFF,
        ]);
        DB::transaction(function () use ($request, $m_shop) {
            $m_shop->fill($request->all())->save();
        });

        return $m_shop;
    }
}
