<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\MenuRequest;
use App\Http\Resources\Shop\MenuResource;
use App\Http\Resources\Shop\MenusResource;
use App\Models\MMenu;
use App\Models\MShop;
use App\Services\Shop\MenuService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MenuController extends BaseApiController
{
    protected $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    /**
     * Get list master menus
     *
     * @param Request $request
     * @param MShop $shop
     * @return JsonResponse
     */
    public function getMasterMenus(Request $request, MShop $shop): JsonResponse
    {
        $menus = $this->menuService->getList($request, $shop, false);

        return $this->responseApi(MenusResource::collection($menus));
    }

    /**
     * Get list menus
     * @param MenuRequest $request
     * @param MShop       $shop
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(MenuRequest $request, MShop $shop): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $menus = $this->menuService->getList($request, $shop);

        return MenusResource::collection($menus)->additional([
            'status' => 'success',
            'message' => '',
        ]);
    }

    /**
     * Get a menu
     * @param MenuRequest $request
     * @param MShop       $shop
     * @param MMenu       $menu
     *
     * @return array
     */
    public function show(MenuRequest $request, MShop $shop, MMenu $menu): array
    {
        $menu = $this->menuService->getMenu($menu);
        $menu->shop_id = $shop->id;

        return [
            'status' => 'success',
            'message' => '',
            'data' => new MenuResource($menu),
        ];
    }

    /**
     * Create a new menu
     * @param MenuRequest $request
     * @param MShop       $shop
     *
     * @return array
     */
    public function store(MenuRequest $request, MShop $shop): array
    {
        $menu = $this->menuService->create($request, $shop);
        $menu->shop_id = $shop->id;

        return [
            'status' => 'success',
            'message' => '',
            'data' => new MenuResource($menu),
        ];
    }

    /**
     * Update a menu
     *
     * @param MenuRequest $request
     * @param MShop       $shop
     * @param MMenu       $menu
     *
     * @return array
     */
    public function update(MenuRequest $request, MShop $shop, MMenu $menu): array
    {
        try {
            $menu = $this->menuService->updateMenuInfo($request, $shop, $menu);
            $menu->shop_id = $shop->id;

            return [
                'status' => 'success',
                'message' => '',
                'data' => new MenuResource($menu),
            ];
        } catch (\PDOException $e) {
            throw $e;
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => $e->getMessage(),
            ];
        }
    }

    /**
     * Delete a menu
     * @param MShop $shop
     * @param MMenu $menu
     *
     * @return array
     * @throws \Exception
     */
    public function destroy(MShop $shop, MMenu $menu): array
    {
        try {
            $response = $this->menuService->deleteMenu($shop, $menu);

            return [
                'status' => $response ? 'success' : 'failure',
                'message' => '',
                'data' => $response ?? false,
            ];
        } catch (\Exception $e) {
            if ($e->getMessage() === 'menu_in_order') {
                return [
                    'status' => 'failure',
                    'message' => 'Món ăn này đang được phục vụ nên không thể xóa',
                    'data' => false,
                    'result'  => [
                        'fields'=> '',
                        'errorCode'=>'exception',
                        'errorMessage' => 'Món ăn này đang được phục vụ nên không thể xóa'
                    ]
                ];
            }

            throw $e;
        }
    }
}
