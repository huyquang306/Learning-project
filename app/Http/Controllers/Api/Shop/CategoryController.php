<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\CategoryRequest;
use App\Http\Resources\Shop\CategoryResource;
use App\Models\MMenuCategory;
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

    /**
     * Get info of menu category
     *
     * @param MShop $shop
     * @param MMenuCategory $category
     *
     * @return CategoryResource
     */
    public function show(MShop $shop, MMenuCategory $category): CategoryResource
    {
        $category = $this->categoryService->detailCategory($category);

        return new CategoryResource($category);
    }

    /**
     * Create new menu category
     *
     * @param CategoryRequest $request
     * @param MShop $shop
     *
     * @return CategoryResource|array
     */
    public function store(CategoryRequest $request, MShop $shop)
    {
        try {
            $category = $this->categoryService->createCategory($request, $shop);

            return new CategoryResource($category);
        } catch (\PDOException $e) {
            \Log::info($e);
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields' => '', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()],
            ];
        }
    }

    /**
     * Update menu category
     *
     * @param CategoryRequest $request
     * @param MShop $shop
     * @param MMenuCategory $category
     *
     * @return CategoryResource|array
     */
    public function update(CategoryRequest $request, MShop $shop, MMenuCategory $category)
    {
        try {
            $category = $this->categoryService->updateCategory($request, $shop, $category);

            return new CategoryResource($category);
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields'=>'', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields'=>'', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()],
            ];
        }
    }

    /**
     * Delete menu category
     *
     * @param MShop $shop
     * @param MMenuCategory $category
     * @return array
     */
    public function destroy(MShop $shop, MMenuCategory $category): array
    {
        try {
            $this->categoryService->deleteCategory($category);

            return [
                'status' => 'success',
                'message' => '',
                'data' => '',
            ];
        } catch (\PDOException $e) {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => ['fields' => '', 'errorCode' => 'pdo_exception', 'errorMessage' => ''],
            ];
        } catch (\Exception $e) {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => ['fields' => '', 'errorCode' => 'exception', 'errorMessage' => $e->getMessage()],
            ];
        }
    }
}
