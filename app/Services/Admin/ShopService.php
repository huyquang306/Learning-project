<?php

namespace App\Services\Admin;

use App\Models\MShop;
use App\Models\RShopServicePlan;
use App\Repositories\Interfaces\ServicePlanRepositoryInterface as ServicePlanRepository;
use App\Repositories\ShopRepository;
use App\Services\Auth\FirebaseService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

class ShopService
{
    protected $shopRepository;
    protected $servicePlanRepository;
    protected $firebaseService;

    /**
     * ShopService constructor.
     * @param ShopRepository        $shopRepository
     * @param ServicePlanRepository $servicePlanRepository
     * @param FirebaseService       $firebaseService
     */
    public function __construct(
        ShopRepository $shopRepository,
        ServicePlanRepository $servicePlanRepository,
        FirebaseService $firebaseService
    ) {
        $this->shopRepository = $shopRepository;
        $this->servicePlanRepository = $servicePlanRepository;
        $this->firebaseService = $firebaseService;
    }

    /**
     * Get shops
     *
     * @param Request $request
     * @return boolean
     */
    public function getShopsData(Request $request)
    {
        // Get firebase uid of active shops
        $allShopUIds = $this->shopRepository->getAllShopFirebaseUid();
        $firebaseActiveAccounts = $this->firebaseService->getAccountsActiveByUids($allShopUIds);
        $firebaseActiveUIds = array_keys($firebaseActiveAccounts);

        $from = $request->input('from') ?: Carbon::now()->startOfMonth();
        $to = $request->input('to') ?: Carbon::now()->endOfMonth();
        $shops = $this->shopRepository->getShopsDataAdmin($firebaseActiveUIds, $from, $to);
        $freePlan = $this->servicePlanRepository->getFreeServicePlan();
        $shops->map(function ($shop) use ($freePlan) {
            $mServicePlanCount = $shop->mServicePlans->count();
            if ($mServicePlanCount === 0) {
                $shop->mServicePlans = collect([$freePlan]);
            } else {
                $activePlan = $shop->mServicePlans->filter(function ($planTmp) {
                    return $planTmp->pivot->status == RShopServicePlan::ACTIVE_STATUS;
                })->first();
                // Active service plan
                if ($activePlan) {
                    $shop->mServicePlans = collect([$activePlan]);
                } else {
                    // Get last month deactive plan in this month
                    $shop->mServicePlans = collect([
                        $shop->mServicePlans->pop(),
                    ]);
                }
            }

            return $shop;
        });

        return $shops;
    }

    /**
     * Get shop data
     *
     * @return MShop
     */
    public function getShop(MShop $shop)
    {
        return $this->shopRepository->getShopDataAdmin($shop);
    }

    /**
     * Update shop servicePlan
     *
     * @return MShop
     */
    public function updateShopServicePlan(MShop $shop, string $servicePlanId)
    {
        return $this->servicePlanRepository->updateServicePlanShop($shop, $servicePlanId);
    }

    /**
     * Cancel a shop
     *
     * @return bool
     * @throws Exception
     */
    public function cancelShop(MShop $shop)
    {
        try {
            // Check shop disabled
            if (!$shop->is_active) {
                return false;
            }

            $this->shopRepository->cancelShop($shop);

            return true;
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    /**
     * Reopen a shop
     *
     * @return bool
     * @throws Exception
     */
    public function reopenShop(MShop $shop)
    {
        try {
            // Check shop is active
            if ($shop->is_active) {
                return false;
            }

            $this->shopRepository->reopenShop($shop);

            return true;
        } catch (Exception $exception) {
            throw $exception;
        }
    }
}
