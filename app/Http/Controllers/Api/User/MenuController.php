<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\MenuRequest;
use App\Http\Resources\Shop\MenuResource;
use App\Http\Resources\User\CategoryResource;
use App\Http\Resources\User\MenuRecommendResource;
use App\Http\Resources\User\MenusResource;
use App\Models\MMenu;
use App\Models\MShop;
use App\Services\User\MenuService;

class MenuController extends Controller
{
    protected $menuService;

    /**
     * MenuController constructor.
     *
     * @param MenuService $menuService
     */
    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    /**
     * @param MenuRequest $request
     * @param MShop $shop
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(MenuRequest $request, MShop $shop): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $menu = $this->menuService->getList($request, $shop);

        return MenusResource::collection($menu)->additional([
            'status' => 'success',
            'message' => '',
        ]);
    }

    /**
     * Get menu
     *
     * @param MShop $shop
     * @param MMenu $menu
     *
     * @return array
     */
    public function show(MShop $shop, MMenu $menu): array
    {
        $menu = $this->menuService->getMenu($shop, $menu);

        return [
            'status' => 'success',
            'message' => '',
            'data' => new MenuResource($menu),
        ];
    }

    /**
     * @param MenuRequest $request
     * @param MShop $shop
     * @return array
     */
    public function getMenuCategoryRecommend(MenuRequest $request, MShop $shop): array
    {
        $courseHashId = $request->course_hash_id ?? '';
        $menus = $this->menuService->getMenuRecommendWithCategories($shop, $courseHashId);

        $categories = [];
        $array_check = [];

        foreach ($menus as $item) {
            if (!in_array($item->rShopMenu->mMenuCategory[0]->id, $array_check)) {
                $categories[] = $item->rShopMenu->mMenuCategory[0];
                $array_check[] = $item->rShopMenu->mMenuCategory[0]->id;
            }
        }

        return [
            'status' => 'success',
            'message' => '',
            'data' => [
                'categories' =>  CategoryResource::collection(array_unique($categories, SORT_REGULAR)),
                'menu' =>  MenuRecommendResource::collection($menus),
            ],
        ];
    }
}
