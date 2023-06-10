<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Repositories\CourseRepository;
use App\Repositories\MenuRepository;
use App\Repositories\OrderGroupRepository;
use App\Services\ImageService;

class MenuService
{
    protected $menuRepository;
    protected $imageService;
    protected $courseRepository;
    protected $orderGroupRepository;

    public function __construct(
        MenuRepository $menuRepository,
        ImageService $imageService,
        CourseRepository $courseRepository,
        OrderGroupRepository $orderGroupRepository
    ) {
        $this->menuRepository = $menuRepository;
        $this->imageService = $imageService;
        $this->courseRepository = $courseRepository;
        $this->orderGroupRepository = $orderGroupRepository;
    }

    /**
     * Get menus data
     * @param Request $request
     * @param MShop   $shop
     * @param boolean $isLoadRelation
     *
     * @return mixed
     */
    public function getList(Request $request, MShop $shop, bool $isLoadRelation = true)
    {
        $filters = $request->all();
        $listMenus = $this->menuRepository->getList($shop->id, $filters, $isLoadRelation);

        // Check menus in course that is in filter request
        $course = null;
        $listInCourseMenus = [];
        $listMenuInCourseId = [];
        if (!empty($filters['course_hash_id'])) {
            $course = $this->courseRepository->findBy('hash_id', $filters['course_hash_id']);
            $listInCourseMenus = $this->menuRepository->getMenuInCourse($filters['course_hash_id']);
        }
        if (!empty($listInCourseMenus)) {
            $listMenuInCourseId = $listInCourseMenus->pluck('id')->toArray();
        }
        foreach ($listMenus as $menu) {
            $this->updateOlderImageDataToMImage($menu);

            $menu->shop_id = $shop->id;
            $menu->is_belong_to_course = 0;
            $currentPrice = getMenuPriceHelper(
                $menu,
                config('const.function_helper.menu_price.menu_type'),
                $course
            );

            if (in_array($menu->id, $listMenuInCourseId)) {
                $menu->is_belong_to_course = 1;
            }
            $menu->current_price = $currentPrice;
        }

        return $listMenus;
    }
}
