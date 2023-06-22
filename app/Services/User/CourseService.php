<?php

namespace App\Services\User;

use App\Models\MCourse;
use App\Models\MShop;
use App\Models\TOrderGroup;
use App\Repositories\CoursePriceRepository;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CourseService
{
    protected $courseRepository;
    protected $orderGroupRepository;
    protected $orderRepository;
    protected $coursePriceRepository;

    public function __construct(
        CourseRepositoryInterface $courseRepository,
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository,
        CoursePriceRepository $coursePriceRepository
    ) {
        $this->courseRepository = $courseRepository;
        $this->orderGroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
        $this->coursePriceRepository = $coursePriceRepository;
    }

    /**
     * Get course detail by hash id
     *
     * @param string $courseHashId
     *
     * @return MCourse|null
     */
    public function getCourseByHashId($courseHashId): ?MCourse
    {
        return $this->courseRepository->getCourseByHashId($courseHashId);
    }

    /**
     * Get list data of courses
     *
     * @param MShop $shop
     *
     * @return Collection|null
     */
    public function getList(MShop $shop): ?Collection
    {
        $orderCourseTime = Carbon::now()->format('H:i:s');

        return $this->courseRepository->getListCourseForCustomer($shop->id, $orderCourseTime);
    }

    /**
     * Get menu of the course
     *
     * @param MShop $shop
     * @param MCourse $course
     *
     * @return MCourse|null
     */
    public function showDetail(MShop $shop, MCourse $course): ?MCourse
    {
        return $this->courseRepository->showDetail($shop->id, $course);
    }

    /**
     * Update info course to t_ordergroup
     *
     * @param array       $inputData
     * @param MShop       $shop
     * @param TOrderGroup $course
     *
     * @return TOrderGroup|null
     */
    public function updateOrderCourse(array $inputData, MShop $shop, TOrderGroup $ordergroup): ?TOrderGroup
    {
        $course = $this->getCourseByHashId($inputData['course_hash_id']);
        $coursePrice = $this->coursePriceRepository->getCoursePriceByHashId($inputData['block_hash_id']);
        if ($course && $coursePrice) {
            $updateData = [
                'number_of_customers' => $inputData['number_of_customers'],
            ];

            // update data
            $tOrderData = [
                'course_hash_id' => $course->hash_id,
                'course_price_hash_id' => $coursePrice->hash_id,
                'quantity' => $inputData['number_of_customers'],
                'user_hash_id' => $inputData['user_hash_id'],
            ];
            $this->orderGroupRepository->updateOrderGroup($ordergroup->id, $updateData);
            $this->orderRepository->createOrder([$tOrderData], $shop, $ordergroup);
        }

        return $ordergroup;
    }
}
