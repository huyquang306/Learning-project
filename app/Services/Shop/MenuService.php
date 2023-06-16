<?php

namespace App\Services\Shop;

use App\Models\MImage;
use App\Models\MMenu;
use App\Models\MShop;
use App\Repositories\CourseRepository;
use App\Repositories\MenuRepository;
use App\Repositories\OrderGroupRepository;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuService
{
    protected $menuRepository;
    protected $imageService;
    protected $courseRepository;
    protected $orderGroupRepository;

    public function __construct(
        MenuRepository $menuRepository,
        ImageService $imageService,
        CourseRepository $courseRepository,
        OrderGroupRepository $orderGroupRepository
    ) {
        $this->menuRepository = $menuRepository;
        $this->imageService = $imageService;
        $this->courseRepository = $courseRepository;
        $this->orderGroupRepository = $orderGroupRepository;
    }

    /**
     * Get menus data
     * @param Request $request
     * @param MShop   $shop
     * @param boolean $isLoadRelation
     *
     * @return mixed
     */
    public function getList(Request $request, MShop $shop, bool $isLoadRelation = true)
    {
        $filters = $request->all();
        $listMenus = $this->menuRepository->getList($shop->id, $filters, $isLoadRelation);

        // Check menus in course that is in filter request
        $course = null;
        $listInCourseMenus = [];
        $listMenuInCourseId = [];
        if (!empty($filters['course_hash_id'])) {
            $course = $this->courseRepository->findBy('hash_id', $filters['course_hash_id']);
            $listInCourseMenus = $this->menuRepository->getMenuInCourse($filters['course_hash_id']);
        }
        if (!empty($listInCourseMenus)) {
            $listMenuInCourseId = $listInCourseMenus->pluck('id')->toArray();
        }
        foreach ($listMenus as $menu) {
            $this->updateOlderImageDataToMImage($menu);

            $menu->shop_id = $shop->id;
            $menu->is_belong_to_course = 0;
            $currentPrice = getMenuPriceHelper(
                $menu,
                config('const.function_helper.menu_price.menu_type'),
                $course
            );

            if (in_array($menu->id, $listMenuInCourseId)) {
                $menu->is_belong_to_course = 1;
            }
            $menu->current_price = $currentPrice;
        }

        return $listMenus;
    }

    /**
     * Check and Update Older Image Data To MImage
     * @param MMenu $menu
     *
     * @return bool
     */
    protected function updateOlderImageDataToMImage(MMenu $menu): bool
    {
        if ($menu->image_file_name
            || $menu->s_image_folder_path
            || $menu->m_image_folder_path
            || $menu->l_image_folder_path
        ) {
            $originImagePath = $menu->image_file_name
                ?? $menu->m_image_folder_path
                ?? $menu->s_image_folder_path
                ?? $menu->l_image_folder_path;
            $imageData = [
                's_image_path' => $menu->s_image_folder_path,
                'm_image_path' => $menu->m_image_folder_path,
                'l_image_path' => $menu->l_image_folder_path,
                'image_path' => $originImagePath,
            ];
            $newImage = new MImage($imageData);
            $menu->mImages()->save($newImage, [
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $menu->image_file_name = null;
            $menu->s_image_folder_path = null;
            $menu->m_image_folder_path = null;
            $menu->l_image_folder_path = null;
            if (count($menu->mImages) === 0) {
                $menu->main_image_id = $newImage->id;
            }
            $menu->save();
            $menu->load([
                'mImages',
                'mainImage',
            ]);

            return true;
        }

        return false;
    }

    /**
     * Get a menu
     * @param MMenu $menu
     *
     * @return mixed
     */
    public function getMenu(MMenu $menu)
    {
        $menu->load([
            'mBusinessHourPrices.mShopBusinessHour',
            'menuCookPlace',
            'mTax',
            'mImages',
            'mainImage',
        ]);

        $currentPrice = getMenuPriceHelper($menu);
        $menu->current_price = $currentPrice;

        return $menu;
    }

    /**
     * Create a new menu
     *
     * @param Request $request
     * @param MShop   $shop
     * @return MMenu
     */
    public function create(Request $request, MShop $shop): MMenu
    {
        $attributes = $request->only([
            'name',
            'price',
            'tax_value',
            'status',
            'm_menu_category_ids',
            'is_recommend',
            'is_promotion',
            'estimated_preparation_time',
            'shop_cook_place_id',
            'm_shop_business_hour_prices',
            'm_tax_id',
            'initial_order_flg',
        ]);
        $attributes['hash_id'] = $this->menuRepository->makeHashId();
        $menu = $this->menuRepository->create($attributes, $shop);
        if ($request->add_images && count($request->add_images)) {
            $this->menuRepository->saveNewMenuImages($menu, $request->add_images);
        }
        if ($request->delete_images && count($request->delete_images)) {
            $this->deleteSpecifiedImagesMenu($menu, $request->delete_images);
        }
        if ($request->main_image_path) {
            $this->menuRepository->changeMainMenuImage($menu, $request->main_image_path);
        }

        $menu->load([
            'mBusinessHourPrices.mShopBusinessHour',
            'menuCookPlace',
            'mTax',
            'mImages',
            'mainImage',
        ]);
        $currentPrice = getMenuPriceHelper($menu);
        $menu->current_price = $currentPrice;

        return $menu->refresh();
    }

    /**
     * Update a menu info
     * @param Request $request
     * @param MShop $shop
     * @param MMenu $menu
     *
     * @return MMenu
     * @throws \Exception
     */
    public function updateMenuInfo(Request $request, MShop $shop, MMenu $menu): MMenu
    {
        $attributes = $request->only([
            'name',
            'price',
            'tax_value',
            'status',
            'is_recommend',
            'is_promotion',
            'estimated_preparation_time',
            'initial_order_flg',
        ]);
        $menu = $this->menuRepository->updateInfo($attributes, $shop, $menu);
        if ($request->add_images && count($request->add_images)) {
            $this->menuRepository->saveNewMenuImages($menu, $request->add_images);
        }
        if ($request->delete_images && count($request->delete_images)) {
            $this->deleteSpecifiedImagesMenu($menu, $request->delete_images);
        }
        $this->menuRepository->changeMainMenuImage($menu, $request->main_image_path);
        $this->updateOlderImageDataToMImage($menu);

        $menu->load([
            'mBusinessHourPrices.mShopBusinessHour',
            'menuCookPlace',
            'mTax',
        ]);
        $currentPrice = getMenuPriceHelper($menu);
        $menu->current_price = $currentPrice;

        return $menu->refresh();
    }

    /**
     * Delete a menu
     * @param MShop $shop
     * @param MMenu $menu
     *
     * @return boolean
     * @throws \Exception
     */
    public function deleteMenu(MShop $shop, MMenu $menu): bool
    {
        $checkCanDeleteMenu = $this->checkCanDeleteMenu($shop, $menu);
        if ($checkCanDeleteMenu) {
            $this->deleteAllImagesMenu($menu);

            return $this->menuRepository->delete($menu->id);
        }

        throw new \Exception('menu_in_order');
    }

    /**
     * Delete specified image menus
     * @param MMenu $menu
     * @param array $deleteImagePaths
     *
     * @return void
     */
    protected function deleteSpecifiedImagesMenu(MMenu $menu, array $deleteImagePaths)
    {
        $mImages = $this->menuRepository->findMenuImageByImagePaths($menu, $deleteImagePaths);
        $this->menuRepository->deleteMenuImages($menu, $deleteImagePaths);

        foreach ($mImages as $image) {
            if ($image->s_image_path) {
                $deleteImagePaths[] = $image->s_image_path;
            }
            if ($image->m_image_path) {
                $deleteImagePaths[] = $image->m_image_path;
            }
            if ($image->l_image_path) {
                $deleteImagePaths[] = $image->l_image_path;
            }
            if ($image->image_path) {
                $deleteImagePaths[] = $image->image_path;
            }
        }
        $deleteImagePaths = array_unique($deleteImagePaths);
        $this->deleteSpecifiedImagesInS3($deleteImagePaths);
    }

    /**
     * Delete images in S3
     * @param array $deleteImagePaths
     *
     * @return void
     */
    protected function deleteSpecifiedImagesInS3(array $deleteImagePaths)
    {
        /*
        if (config('queue.connections.image_remove_sqs.queue')) {
            Queue::connection('image_remove_sqs')
                ->pushRaw('{"imagePaths":"' . implode(',', $deleteImagePaths) . '"}');
        }
        */

        foreach ($deleteImagePaths as $deleteImagePath) {
            Storage::disk('s3')->delete($deleteImagePath);
        }
    }
    /**
     * Delete menu images
     * @param MMenu $menu
     *
     * @return bool
     */
    public function deleteAllImagesMenu(MMenu $menu): bool
    {
        $deleteImagePaths = [];
        if ($menu->s_image_folder_path) {
            $deleteImagePaths[] = $menu->s_image_folder_path;
        }
        if ($menu->m_image_folder_path) {
            $deleteImagePaths[] = $menu->m_image_folder_path;
        }
        if ($menu->l_image_folder_path) {
            $deleteImagePaths[] = $menu->l_image_folder_path;
        }
        $menu->load('mImages');
        foreach ($menu->mImages as $image) {
            if ($image->s_image_path) {
                $deleteImagePaths[] = $image->s_image_path;
            }
            if ($image->m_image_path) {
                $deleteImagePaths[] = $image->m_image_path;
            }
            if ($image->l_image_path) {
                $deleteImagePaths[] = $image->l_image_path;
            }
            if ($image->image_path) {
                $deleteImagePaths[] = $image->image_path;
            }
        }
        $deleteImagePaths = array_unique($deleteImagePaths);
        $this->deleteSpecifiedImagesInS3($deleteImagePaths);

        return true;
    }


    /**
     * Check if a menu can be deleted
     *
     * @param MShop $shop
     * @param MMenu $menu
     * @return bool
     */
    public function checkCanDeleteMenu(MShop $shop, MMenu $menu): bool
    {
        $tOrderGroups = $this->orderGroupRepository->getOrderGroupsNotCheckedOut($shop);

        foreach ($tOrderGroups as $tOrderGroup) {
            $tOrders = $tOrderGroup->tOrders->load('rShopMenu');

            foreach ($tOrders as $tOrder) {
                if ($tOrder->rShopMenu) {
                    if ($tOrder->rShopMenu->m_menu_id == $menu->id
                        && $tOrder->status != config('const.STATUS_CANCEL')) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Update a menu and menu resource
     * @param Request $request
     * @param MShop   $shop
     * @param MMenu   $menu
     *
     * @return MMenu
     * @throws \Exception
     */
    public function updateMenu(Request $request, MShop $shop, MMenu $menu)
    {
        $attributes = $request->only([
            'name',
            'price',
            'tax_value',
            'status',
            'm_menu_category_ids',
            'is_recommend',
            'is_promotion',
            'estimated_preparation_time',
            'shop_cook_place_id',
            'm_shop_business_hour_prices',
            'm_tax_id',
        ]);
        $menu = $this->menuRepository->update($attributes, $shop, $menu);
        if ($request->add_images && count($request->add_images)) {
            $this->menuRepository->saveNewMenuImages($menu, $request->add_images);
        }
        if ($request->delete_images && count($request->delete_images)) {
            $this->deleteSpecifiedImagesMenu($menu, $request->delete_images);
        }
        $this->menuRepository->changeMainMenuImage($menu, $request->main_image_path);
        $this->updateOlderImageDataToMImage($menu);

        $menu->load([
            'mBusinessHourPrices.mShopBusinessHour',
            'menuCookPlace',
            'mTax',
        ]);
        $currentPrice = getMenuPriceHelper($menu);
        $menu->current_price = $currentPrice;

        return $menu->refresh();
    }
}
