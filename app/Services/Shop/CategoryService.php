<?php

namespace App\Services\Shop;

use App\Http\Requests\Shop\CategoryRequest;
use App\Models\MMenuCategory;
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

    /**
     * Show detail menu category service
     *
     * @param MMenuCategory $category
     * @return MMenuCategory|null
     */
    public function detailCategory(MMenuCategory $category): ?MMenuCategory
    {
        return $this->categoryRepository->getCategoryDetail($category->id);
    }

    /**
     * Create menu category service
     *
     * @param CategoryRequest $request
     * @param MShop           $shop
     * @return MMenuCategory|null
     */
    public function createCategory(CategoryRequest $request, MShop $shop): ?MMenuCategory
    {
        while (true) {
            $code = makeHash();
            if (!$this->categoryRepository->isCodeDuplicated('code', $code)) {
                break;
            }
        }
        $new_category = $request->only(['name', 'short_name', 'parent_id', 'tier_number']);
        $new_category['code'] = $code;
        $new_category['m_shop_id'] = $shop->id;

        return $this->categoryRepository->createCategory($new_category);
    }

    /**
     * Update menu category service
     *
     * @param CategoryRequest $request
     * @param MShop           $shop
     * @param MMenuCategory   $category
     * @return MMenuCategory|null
     */
    public function updateCategory(CategoryRequest $request, MShop $shop, MMenuCategory $category): ?MMenuCategory
    {
        $update_category = $request->only(['name', 'short_name', 'parent_id', 'tier_number']);

        return $this->categoryRepository->updateCategory($update_category, $category->id);
    }

    /**
     * Delete menu category service
     *
     * @param MMenuCategory $category
     * @return bool
     */
    public function deleteCategory(MMenuCategory $category): bool
    {
        return $this->categoryRepository->deleteCategory($category->id);
    }
}
