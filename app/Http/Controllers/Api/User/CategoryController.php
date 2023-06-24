<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\CategoryRequest;
use App\Http\Resources\User\CategoryResource;
use App\Models\MMenuCategory;
use App\Models\MShop;
use App\Services\User\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $category_service;

    public function __construct(CategoryService $category_service)
    {
        $this->category_service = $category_service;
    }

    /**
     * @param CategoryRequest $request
     * @param MShop $shop
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(CategoryRequest $request, MShop $shop): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $categories = $this->category_service->getCategories($request, $shop);
        return CategoryResource::collection($categories)->additional([
            'status' => 'success',
            'message' => ''
        ]);
    }

    /**
     * @param MShop $shop
     * @param MMenuCategory $category
     * @return CategoryResource
     */
    public function show(MShop $shop, MMenuCategory $category): CategoryResource
    {
        $category = $this->category_service->detailCategory($category);

        return new CategoryResource($category);
    }
}
