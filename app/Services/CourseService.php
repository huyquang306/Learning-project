<?php

namespace App\Services;

use App\Models\MShop;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Repositories\Interfaces\CourseRepositoryInterface;

class CourseService
{
    protected $courseRepository;

    public function __construct(
        CourseRepositoryInterface $courseRepository
    ) {
        $this->courseRepository = $courseRepository;
    }

    /**
     * Get list data of courses
     *
     * @param MShop   $shop
     * @param Request $request
     *
     * @return Collection|null
     */
    public function getList(MShop $shop, Request $request): ?Collection
    {
        $statusFilter = $request->status ?? null;

        return $this->courseRepository->getList($shop->id, $statusFilter);
    }

    /**
     * @param MShop $shop
     * @param Request $request
     * @return Collection|null
     */
    public function getListCourseMasterData(MShop $shop, Request $request): ?Collection
    {
        $isAvailable = $request->available ?? null;
        $statusFilter = $request->status ?? null;

        return $this->courseRepository->getListCourseMasterData($shop->id, $statusFilter, $isAvailable);
    }
}
