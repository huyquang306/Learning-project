<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\CourseRequest;
use App\Http\Requests\Shop\CourseUpdateRequest;
use App\Http\Requests\Shop\MenuInCourseRequest;
use App\Http\Resources\Shop\CourseResource;
use App\Models\MCourse;
use App\Models\MMenu;
use App\Models\MShop;
use App\Services\Shop\CourseService;
use Exception;
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
    public function show(MShop $shop, MCourse $course): JsonResponse
    {
        $course = $this->courseService->showDetail($shop, $course);

        return $this->responseApi(new CourseResource($course));
    }

    /**
     * Create course and setting time block in course
     * @param CourseRequest $request
     * @param MShop $shop
     * @return JsonResponse
     * @throws Exception
     */
    public function create(CourseRequest $request, MShop $shop): JsonResponse
    {
        $course = $this->courseService->create($request, $shop);

        return $this->responseApi(new CourseResource($course));
    }

    /**
     * Update course menu
     * @param CourseUpdateRequest $request
     * @param MShop $shop
     * @param MCourse $course
     * @return JsonResponse
     * @throws Exception
     */
    public function update(CourseUpdateRequest $request, MShop $shop, MCourse $course): JsonResponse
    {
        $course = $this->courseService->updateCourse($request, $shop, $course);

        return $this->responseApi(new CourseResource($course));
    }

    /**
     * Update menu in course
     * @param CourseUpdateRequest $request
     * @param MShop               $shop
     * @param MCourse             $course
     * @return JsonResponse
     */
    public function updateMenuCourse(CourseUpdateRequest $request, MShop $shop, MCourse $course): JsonResponse
    {
        $menuCourse = $this->courseService->updateMenuInCourse($request, $shop, $course);

        return $this->responseApi(new CourseResource($menuCourse));
    }

    /**
     * Delete course
     *
     * @param MShop   $shop
     * @param MCourse $course
     * @return JsonResponse
     */
    public function delete(MShop $shop, MCourse $course): JsonResponse
    {
        return $this->responseApi($this->courseService->deleteCourse($course));
    }

    /**
     * Add menu into a course
     * @param MenuInCourseRequest $request
     * @param MShop $shop
     * @param MCourse $course
     * @return JsonResponse
     * @throws Exception
     */
    public function addMenuCourse(MenuInCourseRequest $request, MShop $shop, MCourse $course): JsonResponse
    {
        $menuCourse = $this->courseService->addMenuToCourse($request, $course);

        return $this->responseApi(new CourseResource($menuCourse));
    }

    /**
     * Delete menu in course
     *
     * @param MShop $shop
     * @param MCourse $course
     * @param Mmenu $menu
     * @return JsonResponse
     * @throws Exception
     */
    public function deleteMenuCourse(MShop $shop, MCourse $course, Mmenu $menu): JsonResponse
    {
        $menuCourse = $this->courseService->deleteMenuInCourse($course, $menu);

        return $this->responseApi(new CourseResource($menuCourse));
    }
}
