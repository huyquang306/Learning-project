<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Shop\MenusResource;
use App\Models\MShop;
use App\Services\Shop\MenuService;
use Illuminate\Http\Request;

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
    public function getMasterMenus(Request $request, MShop $shop)
    {
        $menus = $this->menuService->getList($request, $shop, false);

        return $this->responseApi(MenusResource::collection($menus));
    }
}
