<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\FunctionResource;
use App\Services\Admin\FunctionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FunctionController extends BaseApiController
{
    protected $functionService;

    public function __construct(FunctionService $functionService)
    {
        $this->functionService = $functionService;
    }

    /**
     * Get all function conditions
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $functions = $this->functionService->getFunctions();

        return $this->responseApi(FunctionResource::collection($functions));
    }
}
