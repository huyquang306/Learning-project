<?php

namespace App\Services;

use App\Models\MShop;
use App\Models\TTmpShop;
use App\Repositories\StaffRepository;
use App\Repositories\Interfaces\TmpShopRepositoryInterface;
use App\Repositories\ShopRepository;
use App\Repositories\TableRepository;
use App\Services\Auth\FirebaseService;
use App\Services\GenreService;
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
    protected $genreService;

    public function __construct(
        ShopRepository $shopRepository,
        StaffRepository $staffRepository,
        TableRepository $tableRepository,
        TmpShopRepositoryInterface $tmpShopRepository,
        FirebaseService $firebaseService,
        GenreService $genreService
    ) {
        $this->shopRepository = $shopRepository;
        $this->staffRepository = $staffRepository;
        $this->tableRepository = $tableRepository;
        $this->tmpShopRepository = $tmpShopRepository;
        $this->firebaseService = $firebaseService;
        $this->genreService = $genreService;
    }

    /**
     * Create a new tmp shop
     *
     * @param Request $request
     * @return TTmpShop
     * @throws \Exception
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
        } catch (\Exception $exception) {
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
     * ユーザーIDから店舗情報を取得する
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
//        $this->categoryRepository->createDefaultCategoryByShop($shop->id);
//        $this->shopRepository->createDefaultCookPlaceByShop($shop);
//        $this->shopRepository->createDefaultMenusByShop($shop);

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
        $this->registerDefaultServicePlan($shop);

        // Default, when create a new shop, setting country of shop is JP.
        // If developing features for countries, it needs to be fixed here
        $countryCode = MShop::DEFAULT_COUNTRY_CODE;
        $this->shopRepository->generateShopTaxInfo($shop, $countryCode);

        $this->shopRepository->updateShopCountryJP($shop);

        return $shop->load('mShopPosSetting.mCurrency');
    }
}
