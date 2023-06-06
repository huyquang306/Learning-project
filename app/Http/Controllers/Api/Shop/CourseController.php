<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\CourseResource;
use App\Models\MShop;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourseController extends BaseApiController
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    public function index(Request $request, MShop $shop): \Illuminate\Http\JsonResponse
    {
        $results = $this->courseService->getList($shop, $request);

        return $this->responseApi(CourseResource::collection($results));
    }

    /**
     * Get list master data of courses
     *
     * @param Request $request
     * @param MShop $shop
     * @return JsonResponse
     */
    public function getMasterCourses(Request $request, MShop $shop): JsonResponse
    {
        $results = $this->courseService->getListCourseMasterData($shop, $request);

        return $this->responseApi(CourseResource::collection($results));
    }
}
