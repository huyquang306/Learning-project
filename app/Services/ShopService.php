<?php

namespace App\Services;

use App\Models\MMenu;
use App\Models\MShop;
use App\Models\MShopMeta;
use App\Models\MTable;
use App\Models\TTmpShop;
use App\Repositories\Interfaces\ServicePlanRepositoryInterface as ServicePlanRepository;
use App\Repositories\OrderGroupRepository;
use App\Repositories\ShopMetaRepository;
use App\Repositories\StaffRepository;
use App\Repositories\Interfaces\TmpShopRepositoryInterface;
use App\Repositories\ShopRepository;
use App\Repositories\TableRepository;
use App\Services\Auth\FirebaseService;
use App\Services\GenreService;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShopService
{
    protected $tmpShopRepository;
    protected $firebaseService;
    protected $shopRepository;
    protected $staffRepository;
    protected $tableRepository;
    protected $shopMetaRepository;
    protected $genreService;
    protected $servicePlanRepository;
    protected $orderGroupRepository;

    public function __construct(
        ShopRepository $shopRepository,
        StaffRepository $staffRepository,
        TableRepository $tableRepository,
        TmpShopRepositoryInterface $tmpShopRepository,
        ShopMetaRepository $shopMetaRepository,
        FirebaseService $firebaseService,
        GenreService $genreService,
        ServicePlanRepository $servicePlanRepository,
        OrderGroupRepository $orderGroupRepository
    ) {
        $this->shopRepository = $shopRepository;
        $this->staffRepository = $staffRepository;
        $this->tableRepository = $tableRepository;
        $this->tmpShopRepository = $tmpShopRepository;
        $this->shopMetaRepository = $shopMetaRepository;
        $this->firebaseService = $firebaseService;
        $this->genreService = $genreService;
        $this->servicePlanRepository = $servicePlanRepository;
        $this->orderGroupRepository = $orderGroupRepository;
    }

    /**
     * Create a new tmp shop
     *
     * @param Request $request
     * @return TTmpShop
     * @throws Exception
     */
    public function createTmpShop(Request $request): TTmpShop
    {
        DB::beginTransaction();
        try {
            $type = TTmpShop::REGISTER_SHOP_TYPE;
            if ($request->is_active_shop) {
                // Case 1: copy shop
                $type = TTmpShop::COPY_DEACTIVATE_SHOP_TYPE;
                $shopData = $request->only([
                    'hash_id',
                    'email',
                ]);
                $shopData['m_staff_id'] = Auth::User() ? Auth::User()->m_staff_id : null;
            } else {
                // Case 2: register new shop
                $shopData = $request->only([
                    'name',
                    'email',
                    'phone_number',
                    'address',
                    'postal_code',
                    'prefecture',
                    'start_time',
                    'end_time',
                    'city',
                    'genre',
                    'lat',
                    'lon',
                    'building',
                ]);
            }
            $tmpShop = $this->tmpShopRepository->save($shopData, $type);
            $verifyLink = $this->generateVerifyLink(TTmpShop::REGISTER_LINK_TYPE, $tmpShop->hash_id);
            $this->firebaseService->sendRegisterVerifyLink($shopData['email'], $verifyLink);
            DB::commit();

            return $tmpShop;
        } catch (Exception $exception) {
            DB::rollBack();

            throw $exception;
        }
    }

    /**
     * Generate verify email link
     *
     * @param string $type
     * @param string $token
     * @return string
     */
    protected function generateVerifyLink(string $type, string $token): string
    {
        $smartOrderUrl = env('SMART_ORDER_APP_URL', '');
        $shopPath = env('MIX_INDEX_PATH_SHOP_ORDER', '');

        return "$smartOrderUrl$shopPath/verify-email?type=$type&token=$token";
    }

    /**
     * Find shop by user
     *
     * @param int $id
     * @return Collection
     */
    public function findByUser(int $id): Collection
    {
        $shops = $this->shopRepository->findShopByUser($id);
        $shops->map(function ($shop) {
            $shop->items = $shop->mItems;
            $shop->genres = $shop->mGenres;

            return $shop;
        });

        return $shops;
    }

    public function getShopData(MShop $shop): MShop
    {
        $shop = $this->shopRepository->getShopData($shop);
        $shop->items = $shop->mItems;
        $shop->genres = $shop->mGenres;

        return $shop;
    }

    /**
     * Verify shop register
     *
     * @param string $hashId
     * @return MShop
     * @throws Exception
     */
    public function verifyShopRegister(string $hashId): MShop
    {
        // check code exist and hasn't expired
        $validCode = $this->tmpShopRepository->validCode($hashId);
        $shopTmp = $this->tmpShopRepository->findByHashId($hashId);

        $isRegisterType = $shopTmp && ($shopTmp->type === TTmpShop::COPY_DEACTIVATE_SHOP_TYPE
                || $shopTmp->type === TTmpShop::REGISTER_SHOP_TYPE);
        if (!$validCode || !$shopTmp || !$isRegisterType) {
            throw new Exception('This code has expired or is invalid');
        }

        $shopInfo = (array) json_decode($shopTmp->shop_info);
        $shopExisted = $this->shopRepository->findShopByEmail($shopInfo['email']);

        // Check shop existed
        if ($shopExisted) {
            throw new Exception('This store already exists');
        }


        DB::beginTransaction();
        try {
            // Case 1: copy shop
            if ($shopTmp->type === TTmpShop::COPY_DEACTIVATE_SHOP_TYPE) {
                $shop = $this->shopRepository->findShopsByHashId($shopInfo['hash_id']);
                if (!$shop) {
                    throw new Exception('This code has expired or is invalid');
                }
                $this->shopRepository->saveActiveShop($shop);
                $this->shopRepository->update($shop->id, [
                    'email' => $shopInfo['email'],
                ]);
                $this->attachUser($shop, array_unique(array_filter([
                    Auth::User() ? Auth::User()->m_staff_id : null,
                    $shopInfo['m_staff_id'],
                ])));
            } else {
                // Case 2: register new shop
                // Copy shop from tmp_shop to m_shop, attach m_staff
                $shop = $this->saveCloneShop($shopInfo);
                $this->genreService->saveGenre($shop, $shopInfo['genre']);
                $firebaseAccount = $this->firebaseService->getFirebaseAccountByEmail($shop->email);
                if ($firebaseAccount) {
                    $sAccount = $this->staffRepository->getSAccountByFireBaseUid($firebaseAccount->uid);
                    if ($sAccount) {
                        $this->attachUser($shop, [$sAccount->m_staff_id]);
                    }
                }
            }

            // Create default tables
            $this->tableRepository->createDefaultTablesForShop($shop);

            // Update verified in firebase
            $res = $this->firebaseService->updateAccount($shopInfo['email'], [
                'emailVerified' => true,
            ]);
            if (!$res) {
                throw new Exception('Update to firebase has failed');
            }

            // Delete shop tmp
            $shopTmp->delete();
            DB::commit();

            return $shop;
        } catch (Exception $e) {
            Log::info($e);
            DB::rollBack();

            throw $e;
        }
    }

    /**
     * Send email verification register
     *
     * @param string $email
     * @return bool
     */
    public function sendEmailVerifyRegister(string $email): bool
    {
        $tmpShop = $this->tmpShopRepository->findByEmail($email);
        if (!$tmpShop) {
            return false;
        }
        $verifyLink = $this->generateVerifyLink(TTmpShop::REGISTER_LINK_TYPE, $tmpShop->hash_id);
        $this->firebaseService->sendRegisterVerifyLink($email, $verifyLink);

        return true;
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
        return $this->shopRepository->attachUser($m_shop, $m_staff_ids);
    }

    /**
     * Save shop clone
     *
     * @param array $data
     * @return MShop
     */
    public function saveCloneShop(array $data): MShop
    {
        while (true) {
            $hashId = makeHash();
            if ($this->shopRepository->shopDuplicateCheck('hash_id', $hashId)) {
                break;
            }
        }

        $data = array_merge($data, [
            'hash_id' => $hashId
        ]);

        $shop = $this->shopRepository->create($data);

        // Create data default
        //$this->categoryRepository->createDefaultCategoryByShop($shop->id);
        //$this->shopRepository->createDefaultCookPlaceByShop($shop);
        //$this->shopRepository->createDefaultMenusByShop($shop);

        return $shop;
    }

    /**
     * Generate shop tax info when create shop if not created
     *
     * @param MShop $shop
     * @return MShop
     */
    public function generateShopTaxInfo(MShop $shop): MShop
    {
        //$this->registerDefaultServicePlan($shop);

        // Default, when create a new shop, setting country of shop is VN.
        // If developing features for countries, it needs to be fixed here
        $countryCode = MShop::DEFAULT_COUNTRY_CODE;
        $this->shopRepository->generateShopTaxInfo($shop, $countryCode);

        $this->shopRepository->updateShopCountryVN($shop);

        return $shop->load('mShopPosSetting.mCurrency');
    }

    public function registerDefaultFreePlan(MShop $shop): MShop
    {
        $this->servicePlanRepository->registerDefaultFreePlan($shop);

        return $shop;
    }

    public function find(string $id)
    {
        return $this->shopRepository->findShopsByHashId($id);
    }

    /**
     * Update shop basic info
     *
     * @param ShopRequest $request
     * @return MShop
     */
    public function update($request)
    {
        $shop = $this->shopRepository->save($request);
        $this->shopMetaRepository->updateShopMetaByKey($shop->id, MShopMeta::SNS_LINK_TYPE, $request->sns_links);
        $this->shopMetaRepository->updateShopMetaByKey($shop->id, MShopMeta::INSTAGRAM_LINK_TYPE, $request->instagram_link);

        return $shop;
    }

    /**
     * Generate forgot password link to email
     *
     * @param string $email
     * @throws Exception
     */
    public function generateForgotPasswordLink(string $email)
    {
        $shop = $this->shopRepository->findBy('email', $email, false);
        if (!$shop) {
            return ;
        }

        DB::beginTransaction();
        try {
            $tmpShop = $this->tmpShopRepository->save([
                'email' => $email,
            ], TTmpShop::FORGOT_PASSWORD_TYPE);
            $forgotLink = $this->generateVerifyLink(TTmpShop::FORGOT_PASSWORD_LINK_TYPE, $tmpShop->hash_id);
            $this->firebaseService->sendForgotPasswordLink($email, $forgotLink);

            DB::commit();
        } catch (Exception $exception) {
            DB::rollBack();

            throw $exception;
        }
    }

    /**
     * Verify shop forgot password
     *
     * @param string $hashId
     * @return mixed
     */
    public function verifyShopForgotPassword(string $hashId)
    {
        try {
            // check code exist and hasn't expired
            return $this->tmpShopRepository->validCode($hashId);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Reset password
     *
     * @param string $hashId
     * @param string $password
     * @return bool
     * @throws Exception
     */
    public function resetPassword(string $hashId, string $password): bool
    {
        // check code exist and hasn't expired
        $validCode = $this->tmpShopRepository->validCode($hashId);
        if (!$validCode) {
            throw new Exception('Mã này đã hết hạn hoặc không hợp lệ.');
        }
        $shopTmp = $this->tmpShopRepository->findByHashAndType($hashId, TTmpShop::FORGOT_PASSWORD_TYPE);
        if (!$shopTmp) {
            throw new Exception('Cửa hàng không tồn tại');
        }
        $shopInfo = (array) json_decode($shopTmp->shop_info);

        // check shop existed by email
        $shopExisted = $this->shopRepository->findShopByEmail($shopInfo['email']);
        if (!$shopExisted) {
            throw new Exception('Shop does not existed');
        }

        DB::beginTransaction();
        try {
            // update verified
            $res = $this->firebaseService->updateAccount($shopInfo['email'], [
                'password' => $password,
            ]);
            if (!$res) {
                throw new Exception('Đã có lỗi xảy ra');
            }

            // delete shop tmp
            $shopTmp->delete();
            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getListShopWithPaymentInfo()
    {
        return $this->shopRepository->getListShopWithPaymentInfo();
    }

    public function getStatistics(MShop $shop, $filterData = null): array
    {
        if ($filterData) {
            // TODO statistics by filter condition
        }

        $startTime = Carbon::now()->startOfMonth()->format('Y-m-d H:i:s');
        $endTime = Carbon::now()->endOfMonth()->format('Y-m-d H:i:s');
        $orderGroupsInMonth = $this->orderGroupRepository->getOrderGroupsInTime($shop, $startTime, $endTime);
        $totalIncome = $orderGroupsInMonth->reduce(function ($amount, $order) {
            return $amount + $order->total_billing;
        }, 0);

        $listMenu = [];
        $listTable = [];
        foreach ($orderGroupsInMonth as $orderGroup) {
            $orders = $orderGroup->tOrders;
            foreach ($orders as $order) {
                if (!$order->rShopMenu) continue;
                $menu = $order->rShopMenu->mMenu;
                if (!in_array($menu->id, array_keys($listMenu))) {
                    $listMenu[$menu->id] = 1;
                } else {
                    $listMenu[$menu->id] = $listMenu[$menu->id] + 1;
                }
            }

            $tables = $orderGroup->mTables;
            foreach ($tables as $table) {
                if (!in_array($table->id, array_keys($listTable))) {
                    $listTable[$table->id] = 1;
                } else {
                    $listTable[$table->id] = $listTable[$table->id] + 1;
                }
            }
        }

        $mostOrderedMenuIds = [];
        $mostOrderedTableIds = [];
        $maxMenu = max($listMenu);
        $maxTable = max($listTable);
        foreach ($listMenu as $key => $value) {
            if ($value === $maxMenu) {
                $mostOrderedMenuIds[] = $key;
            }
        }
        foreach ($listTable as $key => $value) {
            if ($value === $maxTable) {
                $mostOrderedTableIds[] = $key;
            }
        }

        $mostOrderedMenu = MMenu::query()->whereIn('id', $mostOrderedMenuIds)
            ->get();
        $mostOrderedMenu->each(function (&$item) use ($maxMenu) {
            $item->count = $maxMenu;
        });

        $mostOrderedTable = MTable::query()->whereIn('id', $mostOrderedTableIds)
            ->get();
        $mostOrderedTable->each(function (&$item) use ($maxTable) {
            $item->count = $maxTable;
        });

        return [
            'totalIncome' => $totalIncome,
            'mostOrderedMenu' => $mostOrderedMenu,
            'mostOrderedTable' => $mostOrderedTable,
        ];
    }
}
