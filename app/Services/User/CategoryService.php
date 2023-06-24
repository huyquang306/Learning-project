<?php

namespace App\Services\User;

use App\Http\Requests\User\CategoryRequest;
use App\Models\MMenuCategory;
use App\Models\MShop;
use App\Repositories\CategoryRepository;

class CategoryService
{
    protected $category_repository;

    public function __construct(CategoryRepository $category_repository)
    {
        $this->category_repository = $category_repository;
    }

    /**
     * Get categories by shop_id service
     * @param CategoryRequest $request
     * @param MShop $shop
     * @return mixed
     */
    public function getCategories(CategoryRequest $request, MShop $shop)
    {
        return $this->category_repository->getCategories($shop->id, $request->tier_number, $request->parent_id);
    }

    /**
     * Show detail menu category service
     *
     * @param MMenuCategory $category
     * @return MMenuCategory|mixed
     */
    public function detailCategory(MMenuCategory $category)
    {
        return $this->category_repository->getCategoryDetail($category->id);
    }
}