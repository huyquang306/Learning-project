<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyShopRequest;
use App\Http\Requests\ShopRequest;
use App\Http\Requests\TmpShopRequest;
use App\Http\Resources\Shop\ShopResource;
use App\Models\MShop;
use App\Services\Shop\BusinessHourService;
use App\Services\ShopService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Kreait\Firebase\Auth\SendActionLink\FailedToSendActionLink;

class ShopController extends BaseApiController
{
    protected $shopService;
    protected $businessHourService;

    public function __construct(
        ShopService $shopService,
        BusinessHourService $businessHourService
    ) {
        $this->shopService = $shopService;
        $this->businessHourService = $businessHourService;
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
                $this->shopService->generateShopTaxInfo($shop);
                $shops[$key] = $this->shopService->getShopData($shop);
            }

            return $this->responseApi(ShopResource::collection($shops));
        }

        $this->shopService->generateShopTaxInfo($shop);
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
            $this->shopService->generateShopTaxInfo($response);

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

    public function update(ShopRequest $request, MShop $shop): JsonResponse
    {
        $request->merge(
            array(
                'hash_id' => $shop->hash_id
            )
        );

        $shop = $this->shopService->update($request);
        $this->businessHourService->updateBusinesses($request->businessHours, $shop);
        $shop = $this->shopService->getShopData($shop);

        return $this->responseApi(new ShopResource($shop));
    }

    /**
     * Generate forgot password link to email
     *
     * @param ForgotPasswordRequest $request
     * @return JsonResponse
     */
    public function generateForgotPasswordLink(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $this->shopService->generateForgotPasswordLink($request->email);

            return $this->responseApi(true);
        } catch (FailedToSendActionLink $exception) {
            if ($exception->getMessage() === config('const.exceptions.firebase.reset_password_exceed_limit')) {
                return $this->responseApi(
                    false,
                    400,
                    $exception->getMessage()
                );
            }
        } catch (\Exception $exception) {
            return $this->responseApi(true);
        }

        return $this->responseApi(true);
    }

    /**
     * Verify shop forgot password
     *
     * @param VerifyShopRequest $request
     * @return JsonResponse
     */
    public function verifyShopForgotPassword(VerifyShopRequest $request): JsonResponse
    {
        $response = $this->shopService->verifyShopForgotPassword($request->token);

        return $this->responseApi($response);
    }

    /**
     * Verify reset password
     *
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            $response = $this->shopService->resetPassword($request->token, $request->password);

            return $this->responseApi($response);
        } catch (\PDOException $e) {
            throw $e;
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields'=>'', 'errorCode'=>'exception', 'errorMessage' => $e->getMessage()]
            ];
        }
    }
}
