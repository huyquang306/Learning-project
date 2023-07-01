<?php

namespace App\Services\User;

use App\Models\MMenu;
use App\Models\MShop;
use App\Repositories\CourseRepository;
use App\Repositories\MenuRepository;
use Illuminate\Http\Request;

class MenuService
{
    protected $menuRepository;
    protected $courseRepository;

    /**
     * MenuService constructor.
     * @param MenuRepository $menuRepository
     * @param CourseRepository $courseRepository
     */
    public function __construct(
        MenuRepository $menuRepository,
        CourseRepository $courseRepository
    ) {
        $this->menuRepository = $menuRepository;
        $this->courseRepository = $courseRepository;
    }

    /**
     * Get menus data
     * @param Request $request
     * @param MShop   $shop
     *
     * @return mixed
     */
    public function getList(Request $request, MShop $shop)
    {
        $filters = $request->all();
        $listMenus = $this->menuRepository->getList($shop->id, $filters)
            ->load([
                'mBusinessHourPrices.mShopBusinessHour',
                'menuCookPlace',
                'mTax',
            ]);

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
            $menu->price = $currentPrice['price_unit_with_tax'];
        }

        return $listMenus;
    }

    /**
     * Get menu
     * @param MShop $shop
     * @param MMenu $menu
     *
     * @return MMenu
     */
    public function getMenu(MShop $shop, MMenu $menu): MMenu
    {
        $currentPrice = getMenuPriceHelper($menu);

        $menu->shop_id = $shop->id;
        $menu->current_price = $currentPrice;
        $menu->price = $currentPrice['price_unit_with_tax'];

        return $menu;
    }

    /**
     * Get Menu Recommend With Categories
     * @param MShop  $shop
     * @param string $courseHashId
     *
     * @return MenuRepository[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getMenuRecommendWithCategories(MShop $shop, $courseHashId)
    {
        $listMenusRecommend = $this->menuRepository->getMenuRecommendWithCategories($shop->id);

        $course = null;
        $listInCourseMenus = [];
        $listMenuInCourseId = [];
        if (!empty($courseHashId)) {
            $course = $this->courseRepository->findBy('hash_id', $courseHashId);
            $listInCourseMenus = $this->menuRepository->getMenuInCourse($courseHashId);
        }
        if (!empty($listInCourseMenus)) {
            $listMenuInCourseId = $listInCourseMenus->pluck('id')->toArray();
        }
        foreach ($listMenusRecommend as $menu) {
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
            $menu->price = $currentPrice['price_unit_with_tax'];
        }

        return $listMenusRecommend;
    }
}