<?php

namespace App\Services\Shop;

use App\Http\Requests\Shop\CategoryRequest;
use App\Models\MShop;
use App\Repositories\CategoryRepository;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Get categories by shop_id service
     * @param CategoryRequest $request
     * @param MShop           $shop
     * @return mixed
     */
    public function getCategories(CategoryRequest $request, MShop $shop)
    {
        $listCategories = $this->categoryRepository->getCategories($shop->id, $request->tier_number, $request->parent_id);
        $listRegisteredMenuCategories = $this->categoryRepository->getRegisteredMenuCategories(
            $shop->id,
            $request->tier_number,
            $request->parent_id
        );

        if (!empty($listRegisteredMenuCategories)) {
            $listRegisteredMenuCategoriesId = $listRegisteredMenuCategories->pluck('id')->toArray();
            foreach ($listCategories as $listCategory) {
                $listCategory->is_belong_to_menu = 0;

                if (in_array($listCategory->id, $listRegisteredMenuCategoriesId)) {
                    $listCategory->is_belong_to_menu = 1;
                }
            }
        }

        return $listCategories;
    }
}
