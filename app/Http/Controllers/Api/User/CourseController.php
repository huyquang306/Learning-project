<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Resources\User\CourseResource;
use App\Http\Resources\User\OrderGroupResource;
use App\Models\MCourse;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Services\User\CourseService;
use App\Services\User\PrinterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends BaseApiController
{
    protected $courseService;
    protected $printerService;

    public function __construct(
        CourseService $courseService,
        PrinterService $printerService
    ) {
        $this->courseService = $courseService;
        $this->printerService = $printerService;
    }

    /**
     * Get list of courses for customer
     *
     * @param MShop $shop
     * @return JsonResponse
     */
    public function index(MShop $shop): JsonResponse
    {
        $results = $this->courseService->getList($shop);

        return $this->responseApi(CourseResource::collection($results));
    }

    /**
     * Get menu of the course
     *
     * @param MShop $shop
     * @param MCourse $course
     *
     * @return JsonResponse
     */
    public function show(MShop $shop, MCourse $course): JsonResponse
    {
        $course = $this->courseService->showDetail($shop, $course);

        return $this->responseApi(new CourseResource($course));
    }

    /**
     * Update info course to t_ordergroup
     *
     * @param Request $request
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     *
     * @return JsonResponse
     */
    public function update(Request $request, MShop $shop, TOrderGroup $ordergroup): JsonResponse
    {
        $inputData['number_of_customers'] = $request->number_of_customers ?? 0;
        $inputData['course_hash_id'] = $request->course_hash_id ?? '';
        $inputData['block_hash_id'] = $request->block_hash_id ?? '';
        $inputData['user_hash_id'] = $request->user_hash_id ?? null;
        $orderGroup = $this->courseService->updateOrderCourse($inputData, $shop, $ordergroup);

        if ($inputData['course_hash_id'] && $inputData['block_hash_id']) {
            $course = $this->courseService->getCourseByHashId($inputData['course_hash_id']);
            // Create print file data
            /*$outputFile = $this->printerService->createOrderByCourseTemplate(
                $shop,
                $orderGroup,
                $course
            );*/
            // Insert to Job Queue
            //$position = config('const.PRINTER_POSITIONS.KITCHEN.value');
            //$this->printerService->insertJobQueue($shop->id, $outputFile, $position);
        }

        return $this->responseApi(new OrderGroupResource($orderGroup));
    }
}
