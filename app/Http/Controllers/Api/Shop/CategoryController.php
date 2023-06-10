<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\CategoryRequest;
use App\Http\Resources\Shop\CategoryResource;
use App\Models\MShop;
use App\Services\Shop\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Get category list of shop
     *
     * @param CategoryRequest $request
     * @param MShop           $shop
     * @return mixed
     */
    public function index(CategoryRequest $request, MShop $shop)
    {
        $categories = $this->categoryService->getCategories($request, $shop);

        return CategoryResource::collection($categories)->additional([
            'status' => 'success',
            'message' => '',
        ]);
    }
}
