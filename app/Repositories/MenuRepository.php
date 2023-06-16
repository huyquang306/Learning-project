<?php

namespace App\Repositories;

use App\Models\MCourse;
use App\Models\MImage;
use App\Models\MMenu;
use App\Models\MShop;
use App\Models\MShopBusinessHourPrice;
use App\Models\RShopMenu;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MenuRepository
{
    /**
     * @param $shop_id
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getMenuRecommendWithCategories($shop_id)
    {
        $query = MMenu::query();

        $query->whereIn('m_menu.id', function ($queryTable) use ($shop_id) {
            $queryTable->from('r_shop_menu')
                ->select('m_menu_id')
                ->where('r_shop_menu.m_shop_id', $shop_id);
        });

        $query->where('is_recommend', 1);

        $query->with(['rShopMenu' => function ($q) use ($shop_id) {
            $q->where('m_shop_id', $shop_id)
                ->with(['mMenuCategory' => function ($q) {
                    $q->where('tier_number', 2);
                }]);
        }]);

        return $query->get();
    }

    /**
     * Get initial order menus
     *
     * @param MShop $shop
     * @return mixed
     */
    public function getInitialOrderMenusByShop(MShop $shop)
    {
        return MMenu::where('initial_order_flg', MMenu::INITIAL_ORDER_MENU_FLAG_TRUE)
            ->where('status', MMenu::ON_SALE_STATUS)
            ->whereHas('mShops', function ($mShopQuery) use ($shop) {
                return $mShopQuery->where('m_shop.id', $shop->id);
            })->get();
    }

    /**
     * Get list menus
     *
     * @param $shopId
     * @param $filters
     * @param bool $isLoadRelation
     * @return mixed
     */
    public function getList($shopId, $filters, bool $isLoadRelation = true)
    {
        $query = MMenu::query();
        if ($isLoadRelation) {
            $query = $query->with([
                'mBusinessHourPrices.mShopBusinessHour',
                'menuCookPlace',
                'mTax',
            ]);
        } else {
            $query = $query->with([
                'mImages',
                'mainImage',
            ])->with([
                'rShopMenu' => function ($rShopMenuQuery) use ($shopId) {
                    $rShopMenuQuery->where('m_shop_id', $shopId)
                        ->with([
                            'mMenuCategory' => function ($mMenuCategoryQuery) {
                                $mMenuCategoryQuery->orderBy('tier_number', 'DESC')
                                    ->with('childCategories.childCategories');
                            },
                        ]);
                },
            ]);
        }

        // filter by Shop
        $query->whereIn('m_menu.id', function ($queryTable) use ($shopId) {
            $queryTable
                ->from('r_shop_menu')
                ->select('m_menu_id')
                ->where('r_shop_menu.m_shop_id', $shopId);
        });

        // filter by category
        if (array_key_exists('category_id', $filters) && $filters['category_id']) {
            $category_id = (int) $filters['category_id'];
            $smallCategoryId = null;
            if (
                array_key_exists('small_category_id', $filters)
                && $filters['small_category_id']
                && $filters['small_category_id'] > 0
            ) {
                $smallCategoryId = (int) $filters['small_category_id'];
            }

            // get menu id from category_id
            $query->whereIn('m_menu.id', function ($queryMenu) use ($category_id, $smallCategoryId) {
                // get menu_id from r_shop_menu
                $queryMenu
                    ->select('m_menu_id')
                    ->from('r_shop_menu')
                    ->whereIn('r_shop_menu.id', function ($queryRShopMenu) use ($category_id) {
                        // get r_shop_menu_id from r_menu_category with $category_id
                        $queryRShopMenu
                            ->from('r_menu_category')
                            ->select('r_shop_menu_id')
                            ->where('r_menu_category.m_menu_category_id', $category_id);
                    });

                if ($smallCategoryId) {
                    $queryMenu
                        ->whereIn('r_shop_menu.id', function ($queryRShopMenu) use ($smallCategoryId) {
                            // get r_shop_menu_id from r_menu_category with $category_id
                            $queryRShopMenu
                                ->from('r_menu_category')
                                ->select('r_shop_menu_id')
                                ->where('r_menu_category.m_menu_category_id', $smallCategoryId);
                        });
                }
            });
        }

        if (isset($filters['course_hash_id']) && $filters['course_hash_id']) {
            $query->with([
                'mCourses' => function ($queryCourse) use ($filters) {
                    $queryCourse->where('hash_id', $filters['course_hash_id'])
                        ->with([
                            'rShopCourse',
                            'mMenus',
                        ]);
                },
            ]);
        } else {
            $query->with([
                'mCourses.rShopCourse',
                'mCourses.mMenus',
            ]);
        }

        // filter by name
        if (isset($filters['name']) && $filters['name']) {
            $query = $query->where('m_menu.name', 'like', '%' . $filters['name'] . '%');
        }

        // filter by recommend
        if (isset($filters['is_recommend']) && $filters['is_recommend']) {
            $query = $query->where('m_menu.is_recommend', 1);
        }

        if (isset($filters['is_promotion']) && $filters['is_promotion']) {
            $query = $query->where('m_menu.is_promotion', 1);
        }

        return $query->get();
    }

    /**
     * Add for order by course: check menu is in course or not
     *
     * @param string $courseHashId
     *
     * @return mixed
     */
    public function getMenuInCourse(string $courseHashId)
    {
        $query = MMenu::query();
        // Query data
        $query->join('r_course_menu', 'm_menu.id', '=', 'r_course_menu.m_menu_id')
            ->join('m_course', 'r_course_menu.m_course_id', '=', 'm_course.id')
            ->where('r_course_menu.status', MCourse::ACTIVE_STATUS)
            ->where('m_course.hash_id', $courseHashId)
            ->where('r_course_menu.deleted_at', '=', null)
            ->selectRaw(
                'm_menu.id'
            )
            ->groupBy('m_menu.id');

        return $query->get();
    }

    /**
     * Make unique hash_id for this Modal
     *
     * @return string
     */
    public function makeHashId(): string
    {
        while (true) {
            $hash_id = makeHash();
            if (!$this->isExist('hash_id', $hash_id)) {
                break;
            }
        }

        return $hash_id;
    }

    /**
     * Check duplicate field value
     *
     * @param string $fieldName
     * @param string $value
     *
     * @return bool
     */
    public function isExist($fieldName, $value): bool
    {
        return MMenu::where($fieldName, $value)->exists();
    }

    /**
     * Create a new menu
     * @param array $attributes
     * @param MShop $shop
     *
     * @return mixed
     * @throws Exception
     */
    public function create(array $attributes, MShop $shop)
    {
        DB::beginTransaction();
        try {
            // Create a new menu
            $attributes['is_recommend'] = array_key_exists('is_recommend', $attributes) && $attributes['is_recommend']
                ? $attributes['is_recommend']
                : 0;
            $menu = MMenu::create($attributes);
            $rShopMenu = RShopMenu::create([
                'm_shop_id' => $shop->id,
                'm_menu_id' => $menu->id
            ]);

            // Create category relations
            $rShopMenu->mMenuCategory()->attach($attributes['m_menu_category_ids']);

            // Create mShopBusinessHourPrices relation
            if (array_key_exists('m_shop_business_hour_prices', $attributes)) {
                foreach ($attributes['m_shop_business_hour_prices'] as $mMenuPrice) {
                    $rShopMenu->mBusinessHourPrices()->create($mMenuPrice);
                }
            }
            DB::commit();

            return $menu;
        } catch (Exception $exception) {
            DB::rollBack();

            throw $exception;
        }
    }

    /**
     * Save some menu images
     * @param MMenu $menu
     * @param array $imagePaths
     *
     * @return void
     */
    public function saveNewMenuImages(MMenu $menu, array $imagePaths)
    {
        foreach ($imagePaths as $imagePath) {
            $now = now();
            $imageData = [
                'image_path' => $imagePath,
            ];
            $imageData['s_image_path'] = $imagePath;
            $imageData['m_image_path'] = $imagePath;
            $imageData['l_image_path'] = $imagePath;
            $menu->mImages()->save(new MImage($imageData), [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        // Push message to resize sqs
        /*
        if (config('app.env') !== 'local') {
            $images = $menu->load('mImages')->mImages;
            foreach ($images as $image) {
                Queue::connection('image_resize_sqs')->pushRaw('{"mImageId":' . $image->id . '}');
            }
        }
        */
    }

    /**
     * Update a menu info
     * @param array $attributes
     * @param MShop $shop
     * @param MMenu $menu
     *
     * @return MMenu
     * @throws \Exception
     */
    public function updateInfo(array $attributes, MShop $shop, MMenu $menu): MMenu
    {
        DB::beginTransaction();
        try {
            $attributes['is_recommend'] = array_key_exists('is_recommend', $attributes) && $attributes['is_recommend']
                ? $attributes['is_recommend']
                : 0;
            $menu->update($attributes);
            $rShopMenu = $menu->rShopMenu()->where('m_shop_id', $shop->id)->first();
            if ($rShopMenu) {
                if (isset($attributes['m_menu_category_ids'])) {
                    // Update category relations
                    $rShopMenu->mMenuCategory()->sync($attributes['m_menu_category_ids']);
                }
            }
            DB::commit();

            return $menu;
        } catch (\Exception $exception) {
            Db::rollBack();

            throw $exception;
        }
    }

    /**
     * Find Menu image by image paths
     *
     * @param MMenu $menu
     * @param array $imagePaths
     *
     * @return Collection
     */
    public function findMenuImageByImagePaths(MMenu $menu, array $imagePaths): Collection
    {
        $menu->load('mImages');
        $imageIds = $menu->mImages->whereIn('image_path', $imagePaths)->pluck('id')->toArray();

        return MImage::whereIn('id', $imageIds)->get();
    }

    /**
     * Delete menu images
     * @param MMenu $menu
     * @param array $imagePaths
     *
     * @return void
     */
    public function deleteMenuImages(MMenu $menu, array $imagePaths)
    {
        $menu->load('mImages');
        $imageIds = $menu->mImages->whereIn('image_path', $imagePaths)->pluck('id')->toArray();

        $menu->mImages()->detach($imageIds);
        MImage::whereIn('id', $imageIds)->delete();
    }

    /**
     * Change main menu image
     * @param MMenu       $menu
     * @param string|null $mainImagePath
     *
     * @return void
     */
    public function changeMainMenuImage(MMenu $menu, string $mainImagePath = null)
    {
        if ($mainImagePath) {
            $menu->load('mImages');
            $mainImage = $menu->mImages->where('image_path', $mainImagePath)->first();
            if ($mainImage) {
                $menu->main_image_id = $mainImage->id;
                $menu->save();
            }
        } else {
            $menu->main_image_id = null;
            $menu->save();
        }
    }

    /**
     * Delete a menu
     * @param $id
     *
     * @return boolean
     */
    public function delete($id): bool
    {
        try {
            DB::beginTransaction();
            $menu = MMenu::find($id)->load('mBusinessHourPrices');
            $menu->mBusinessHourPrices()->delete();
            $menu->rShopMenu()->delete();

            // Remove menu image
            $menu->mImages()->delete();
            $menu->mImages()->detach();

            $menu->delete();
            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();

            return false;
        }
    }

    /**
     * Update a menu
     * @param array $attributes
     * @param MShop $shop
     * @param MMenu $menu
     *
     * @return MMenu
     * @throws Exception
     */
    public function update(array $attributes, MShop $shop, MMenu $menu)
    {
        DB::beginTransaction();
        try {
            $attributes['is_recommend'] = array_key_exists('is_recommend', $attributes) && $attributes['is_recommend']
                ? $attributes['is_recommend']
                : 0;
            $menu->update($attributes);
            $rShopMenu = $menu->rShopMenu()->where('m_shop_id', $shop->id)->first();
            if ($rShopMenu) {
                if (isset($attributes['m_menu_category_ids'])) {
                    // Update category relations
                    $rShopMenu->mMenuCategory()->sync($attributes['m_menu_category_ids']);
                }

                // Update mShopBusinessHourPrices relations
                $businessHourPrices = array_key_exists('m_shop_business_hour_prices', $attributes)
                    ? $attributes['m_shop_business_hour_prices']
                    : [];
                $menuPriceIds = [];
                foreach ($businessHourPrices as $mMenuPrice) {
                    $mMenuPrice['r_shop_menu_id'] = $rShopMenu->id;
                    $updateMenuPrice = MShopBusinessHourPrice::updateOrCreate([
                        'id' => array_key_exists('id', $mMenuPrice) ? $mMenuPrice['id'] : null,
                    ], $mMenuPrice);
                    array_push($menuPriceIds, $updateMenuPrice->id);
                }
                $menuPriceInDB = MShopBusinessHourPrice::where('r_shop_menu_id', $rShopMenu->id)->get()
                    ->pluck('id')
                    ->toArray();
                $removeMenuPriceIds = array_diff($menuPriceInDB, $menuPriceIds);
                MShopBusinessHourPrice::whereIn('id', $removeMenuPriceIds)->delete();
            }
            DB::commit();

            return $menu;
        } catch (\Exception $exception) {
            \Log::error($exception);
            Db::rollBack();

            throw $exception;
        }
    }
}
