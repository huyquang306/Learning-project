<?php

namespace App\Repositories;

use App\Models\MCountry;
use App\Models\MCurrency;
use App\Models\MGenre;
use App\Models\MItem;
use App\Models\MMenu;
use App\Models\MPaymentMethod;
use App\Models\MServicePlan;
use App\Models\MShop;
use App\Models\MShopPosSetting;
use App\Models\MStaff;
use App\Models\RShopServicePlan;
use App\Models\SAccount;
use Carbon\Carbon;
use Exception;
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
                            [$value->id => ['deleted_at' => Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d H:i:s')]],
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

    /**
     * Reopen a shop
     * @param MShop $shop
     *
     * @return MShop
     * @throws Exception
     */
    public function reopenShop(MShop $shop)
    {
        try {
            DB::beginTransaction();

            $shop->is_active = true;
            $shop->contract_cancel_date = null;
            $shop->save();

            $nowStartOfMonth = Carbon::now()->startOfMonth();
            $rShopPlanLastInMonth = RShopServicePlan::where('m_shop_id', $shop->id)
                ->where('end_date', '>=', $nowStartOfMonth)
                ->latest()
                ->first();
            // Check shop reopen at the same cancel month
            if ($rShopPlanLastInMonth) {
                $rShopPlanLastInMonth->status = RShopServicePlan::ACTIVE_STATUS;
                $rShopPlanLastInMonth->end_date = null;
                $rShopPlanLastInMonth->save();
            } else {
                // Create a new free plan for shop
                $freeServicePlan = MServicePlan::where('price', 0)->first();

                if ($freeServicePlan) {
                    $shop->mServicePlans()->attach($freeServicePlan->id, [
                        'status' => RShopServicePlan::ACTIVE_STATUS,
                        'applied_date' => $nowStartOfMonth,
                        'registered_date' => now(),
                    ]);
                }
            }

            DB::commit();

            return $this->getShopData($shop);
        } catch (Exception $exception) {
            DB::rollBack();

            throw $exception;
        }
    }

    /**
     * Cancel a shop
     * @param MShop $shop
     *
     * @return MShop
     * @throws Exception
     */
    public function cancelShop(MShop $shop)
    {
        try {
            DB::beginTransaction();

            // Save shop cancel info
            $shop->is_active = false;
            $shop->contract_cancel_date = now();
            $shop->save();

            // Save service plan cancel date
            RShopServicePlan::where('m_shop_id', $shop->id)
                ->where('status', RShopServicePlan::ACTIVE_STATUS)
                ->update([
                    'status' => RShopServicePlan::CANCEL_STATUS,
                ]);
            // Update end_date to now when upgrade other plans
            RShopServicePlan::where('m_shop_id', $shop->id)
                ->whereNull('end_date')
                ->update([
                    'end_date' => now()->endOfMonth(),
                ]);
            DB::commit();

            return $this->getShopData($shop);
        } catch (Exception $exception) {
            DB::rollBack();

            throw $exception;
        }
    }

    public function getShopDataAdmin(MShop $shop)
    {
        $firstDayInMonth = now()->startOfMonth();
        $lastDayInMonth = now()->lastOfMonth();
        $startDayInMonth = config('const.PAYMENT.START_DAY_PAYMENT_IN_MONTH');
        if ($startDayInMonth) {
            $firstDayInMonth->setDay($startDayInMonth);
            $lastDayInMonth = $firstDayInMonth->copy()->addMonth()->subDay();
        }

        $shop = $shop->load([
            'mItems',
            'mGenres',
            'mBusinessHours',
            'mShopMetas',
            'mStaffsCanPay.tStripeCustomer',
        ])->load([
            'tOrderGroups' => function ($orderGroupQuery) use ($firstDayInMonth, $lastDayInMonth) {
                $orderGroupQuery->with('tOrders')
                    ->whereDate('created_at', '>=', $firstDayInMonth)
                    ->whereDate('created_at', '<=', $lastDayInMonth)
                    ->withTrashed();
            },
        ])->load([
            'tServiceBillings' => function ($billingQuery) use ($firstDayInMonth, $lastDayInMonth) {
                $billingQuery
                    ->whereDate('target_month', '>=', $firstDayInMonth)
                    ->whereDate('target_month', '<=', $lastDayInMonth);
            }
        ])->load('tOrderGroupsInLastMonth.tOrders');
        $shop->mServicePlans = collect([
            $this->getCurrentApplyServicePlan($shop),
        ]);

        return $shop;
    }

    public function getCurrentApplyServicePlan(MShop $shop)
    {
        $currentRServicePlan = RShopServicePlan::where('m_shop_id', $shop->id)
            ->where('status', RShopServicePlan::ACTIVE_STATUS)
            ->with('mServicePlan')
            ->first();

        // If have not plan active, check cancelled plan in current month
        if (!$currentRServicePlan) {
            $currentRServicePlan = RShopServicePlan::where('m_shop_id', $shop->id)
                ->where('end_date', '>=', Carbon::now()->startOfMonth())
                ->with('mServicePlan')
                ->latest()
                ->first();
        }

        // If have not cancelled plan, get free plan
        if (!$currentRServicePlan || !$currentRServicePlan->mServicePlan) {
            $currentPlan = MServicePlan::where('price', 0)->first();
        } else {
            $currentPlan = $currentRServicePlan->mServicePlan;
        }

        return $currentPlan->load([
            'rFunctionConditions.mConditionType',
        ])->load([
            'rFunctionConditions.mFunction.mServicePlanOptions' => function (
                $mServicePlanOptionQuery
            ) use ($currentPlan) {
                $mServicePlanOptionQuery->where('m_service_plan_id', $currentPlan->id);
            },
        ]);
    }

    /**
     * Get firebase uid of shops in db
     *
     * @return array
     */
    public function getAllShopFirebaseUid()
    {
        $allShops = $this->getAll()->load('mStaffs.sAccount');
        $allShopStaffs = $allShops->pluck('mStaffs')->flatten()->unique()->values();
        $allShopSAccounts = $allShopStaffs->pluck('sAccount')->flatten()->unique()->values();

        return $allShopSAccounts->pluck('firebase_uid')->flatten()->unique()->filter(function ($value) {
            return $value != null;
        })->values()->toArray();
    }

    public function getShopsDataAdmin(array $firebaseActiveUIds, $from, $to)
    {
        $activeShopIds = SAccount::whereIn('firebase_uid', $firebaseActiveUIds)
            ->with('mStaff.mShops')
            ->get()->pluck('mStaff.mShops')
            ->flatten()->pluck('id')
            ->toArray();
        $shops = MShop::whereIn('id', $activeShopIds)
            ->whereNull('contract_cancel_date')
            ->orWhereDate('contract_cancel_date', '>=', $from)
            ->withCount([
                'tOrderGroups' => function ($orderGroupQuery) use ($from, $to) {
                    $orderGroupQuery->whereDate('created_at', '>=', $from)
                        ->whereDate('created_at', '<=', $to)
                        ->withTrashed();
                },
            ])->with([
                'tServiceBillings' => function ($serviceBillingQuery) use ($from, $to) {
                    $serviceBillingQuery
                        ->with('tServiceBillingDetails.service')
                        ->whereDate('target_month', '>=', $from)
                        ->whereDate('target_month', '<=', $to);
                },
                'mServicePlans' => function ($servicePlanQuery) use ($from) {
                    $servicePlanQuery->wherePivot('status', RShopServicePlan::ACTIVE_STATUS)
                        ->orWherePivot('end_date', '>=', $from)
                        ->orderBy('r_shop_service_plan.created_at');
                },
            ])->with('mStaffsCanPay.tStripeCustomer')
            ->whereDate('created_at', '<=', Carbon::parse($to));

        $shopList = $shops->paginate(config('const.pagination.admin.shops_pagination'));

        // Load shop's service plans
        foreach ($shopList->items() as $shop) {
            foreach ($shop->mServicePlans as $servicePlan) {
                $servicePlan->load([
                    'rFunctionConditions.mConditionType',
                ])->load([
                    'rFunctionConditions.mFunction.mServicePlanOptions' => function (
                        $mServicePlanOptionQuery
                    ) use ($servicePlan) {
                        $mServicePlanOptionQuery->where('m_service_plan_id', $servicePlan->id);
                    },
                ]);
            }
        }

        return $shopList;
    }

    /**
     * get staff that was authorised payment for shop
     * @param MShop $shop
     *
     * @return mixed
     */
    public function getStaffAuthorisePayment(MShop $shop)
    {
        $shop->load('mStaffsCanPay.tStripeCustomer');

        return $shop->mStaffsCanPay->first();
    }
}
