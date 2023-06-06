<?php

namespace App\Services\User;

use App\Models\MCourse;
use App\Repositories\CoursePriceRepository;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;

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
}
