<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Repositories\Interfaces\CoursePriceRepositoryInterface;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use App\Repositories\MenuRepository;
use App\Services\ImageService;

class CourseService
{
    protected $courseRepository;
    protected $coursePriceRepository;
    protected $menuRepository;
    protected $imageService;

    public function __construct(
        CourseRepositoryInterface $courseRepository,
        CoursePriceRepositoryInterface $coursePriceRepository,
        MenuRepository $menuRepository,
        ImageService $imageService
    ) {
        $this->courseRepository = $courseRepository;
        $this->coursePriceRepository = $coursePriceRepository;
        $this->menuRepository = $menuRepository;
        $this->imageService = $imageService;
    }

    /**
     * Get list data of courses
     *
     * @param MShop   $shop
     * @param Request $request
     *
     * @return mixed
     */
    public function getList(MShop $shop, Request $request): ?Collection
    {
        $statusFilter = $request->status ?? null;

        return $this->courseRepository->getList($shop->id, $statusFilter);
    }
}
