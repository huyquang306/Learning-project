<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\CourseRequest;
use App\Http\Resources\Shop\CourseResource;
use App\Models\MCourse;
use App\Models\MShop;
use App\Services\Shop\CourseService;
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

    /**
     * Show detail course menu
     *
     * @param MShop   $shop
     * @param MCourse $course
     * @return JsonResponse
     */
    public function show(MShop $shop, MCourse $course)
    {
        $course = $this->courseService->showDetail($shop, $course);

        return $this->responseApi(new CourseResource($course));
    }

    /**
     * Create course and setting time block in course
     * @param CourseRequest $request
     * @param MShop         $shop
     * @return JsonResponse
     */
    public function create(CourseRequest $request, MShop $shop)
    {
        $course = $this->courseService->create($request, $shop);

        return $this->responseApi(new CourseResource($course));
    }
}
