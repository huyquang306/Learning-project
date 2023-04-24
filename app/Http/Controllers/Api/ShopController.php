<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Auth\VerifyShopRequest;
use App\Http\Requests\TmpShopRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\MShop;
use App\Services\ShopService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\ShopResource;

class ShopController extends BaseApiController
{
    protected $shopService;

    public function __construct(ShopService $shopService)
    {
        $this->shopService = $shopService;
    }

    /**
     * Get shop data
     *
     * @param Mshop $shop
     * @return JsonResponse
     */
    public function show(MShop $shop): JsonResponse
    {
        if (!$shop->exists) {
            $shops = $this->shopService->findByUser(Auth::User()->m_staff_id);
            foreach ($shops as $key => $shop) {
                $shops[$key] = $this->shopService->getShopData($shop);
            }

            return $this->responseApi(ShopResource::collection($shops));
        }

        $shop = $this->shopService->getShopData($shop);

        return $this->responseApi(ShopResource::collection([$shop]));
    }

    /**
     * Create a new tmp shop
     *
     * @param TmpShopRequest $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function createTmpShop(Request $request): JsonResponse
    {
        try {
            $this->shopService->createTmpShop($request);

            return $this->responseApi(true);
        } catch (\Exception $exception) {
            if ($exception->getMessage() === config('const.exceptions.firebase.too_many_attempts')) {
                return $this->responseApi(
                    false,
                    400,
                    $exception->getMessage()
                );
            } else {
                throw $exception;
            }
        }
    }

    /**
     * Verify shop register
     *
     * @param VerifyShopRequest $request
     * @return JsonResponse
     */
    public function verifyShopRegister(VerifyShopRequest $request)
    {
        try {
            $response = $this->shopService->verifyShopRegister($request->token);
//            $this->shopService->generateShopTaxInfo($response);

            return $this->responseApi($response);
        } catch (\PDOException $e) {
            throw $e;
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields'=>'','errorCode'=>'exception','errorMessage' => $e->getMessage()]
            ];
        }
    }
}
