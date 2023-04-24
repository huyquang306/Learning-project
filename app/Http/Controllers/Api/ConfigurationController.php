<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ConfigurationResource;
use App\Http\Controllers\BaseApiController;
use App\Services\SConfigurationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfigurationController extends BaseApiController
{
    protected $sConfigurationService;

    /**
     * ConfigurationController constructor.
     *
     * @param SConfigurationService $sConfigurationService
     */
    public function __construct(SConfigurationService $sConfigurationService)
    {
        $this->sConfigurationService = $sConfigurationService;
    }

    /**
     * Get configurations
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $configuration = $this->sConfigurationService->getList($request->key);

        return $this->responseApi(new ConfigurationResource($configuration));
    }
}
