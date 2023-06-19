<?php

namespace App\Services\Shop;

use App\Models\MCourse;
use App\Models\MCoursePrice;
use App\Models\MMenu;
use App\Models\MShop;
use App\Repositories\Interfaces\CoursePriceRepositoryInterface;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use App\Repositories\MenuRepository;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Exception;

class CourseService
{
    protected $courseRepository;
    protected $coursePriceRepository;
    protected $menuRepository;
    protected $imageService;

    public function __construct(
        CourseRepositoryInterface $courseRepository,
        CoursePriceRepositoryInterface $coursePriceRepository,
        MenuRepository $menuRepository,
        ImageService $imageService
    ) {
        $this->courseRepository = $courseRepository;
        $this->coursePriceRepository = $coursePriceRepository;
        $this->menuRepository = $menuRepository;
        $this->imageService = $imageService;
    }

    /**
     * Get list data of courses
     *
     * @param MShop   $shop
     * @param Request $request
     *
     * @return mixed
     */
    public function getList(MShop $shop, Request $request): ?Collection
    {
        $statusFilter = $request->status ?? null;

        return $this->courseRepository->getList($shop->id, $statusFilter);
    }

    /**
     * @param MShop $shop
     * @param Request $request
     * @return Collection|null
     */
    public function getListCourseMasterData(MShop $shop, Request $request): ?Collection
    {
        $isAvailable = $request->available ?? null;
        $statusFilter = $request->status ?? null;

        return $this->courseRepository->getListCourseMasterData($shop->id, $statusFilter, $isAvailable);
    }

    /**
     * Show detail course menu
     *
     * @param MShop   $shop
     * @param MCourse $course
     *
     * @return MCourse
     */
    public function showDetail(MShop $shop, MCourse $course): ?MCourse
    {
        return $this->courseRepository->showDetail($shop->id, $course);
    }

    /**
     * @param Request $request
     * @param MShop $shop
     * @return MCourse|null
     * @throws Exception
     */
    public function create(Request $request, MShop $shop): ?MCourse
    {
        try {
            DB::beginTransaction();

            $inputData = $request->all();
            // Prepare data for main course
            $mCourseData = $this->prepareMCourse($inputData);
            // Make hash_id for main course
            $mCourseData['hash_id'] = $this->makeCourseHashId();
            $mCourseData['course_type'] = config('const.COURSE_TYPE.MAIN_COURSE');
            // Insert data main course
            $course = $this->courseRepository->createCourse($mCourseData, $shop->id);
            // Get data course prices of main course
            $mCoursePrices = $inputData['list_course_prices'] ?? [];

            if ($course && $mCoursePrices) {
                $newCoursePrices = $this->prepareCoursePrices($mCoursePrices, $course->rShopCourse->id);

                if ($newCoursePrices) {
                    $this->coursePriceRepository->insertCoursePrices($newCoursePrices);
                }
            }

            $listChildCourses = $inputData['list_child_courses'] ?? [];

            // Insert data children courses
            if (!empty($listChildCourses)) {
                foreach ($listChildCourses as $listChildCourse) {
                    $this->insertChildExtendCourses($course->id, $shop->id, $listChildCourse);
                }
            }

            if ($request->file) {
                $this->uploadImage($shop->hash_id, $course->hash_id, $request->file);
            }

            $listMenus = $inputData['list_menus'] ?? [];

            // Insert data course menus
            if (!empty($listMenus)) {
                $course = $this->addMenuToCourse($request, $course);
            }

            $courseResult = $this->showDetail($shop, $course);
            DB::commit();

            return $courseResult;
        } catch (Exception $e) {
            Log::error($e);
            DB::rollBack();

            return null;
        }
    }

    /**
     * Prepare MCourse Data
     * @param array $inputData
     *
     * @return array
     */
    protected function prepareMCourse(array $inputData): array
    {
        return [
            'name' => $inputData['name'],
            'name_kana' => $inputData['name_kana'] ?? '',
            'time_block_unit' => $inputData['time_block_unit'],
            'status' => $inputData['status'] ?? MCourse::ACTIVE_STATUS,
            'alert_notification_time' => $inputData['alert_notification_time'] ?? 0,
            'initial_propose_flg' => $inputData['initial_propose_flg'] ?? MCourse::INITIAL_PROPOSE_FLG_OFF,
            'shop_alert_flg' => $inputData['shop_alert_flg'] ?? 0,
            'user_alert_flg' => $inputData['user_alert_flg'] ?? 0,
            'shop_end_time_alert_flg' => $inputData['shop_end_time_alert_flg'] ?? 0,
            'user_end_time_alert_flg' => $inputData['user_end_time_alert_flg'] ?? 0,
            'tax_value' => $inputData['tax_value'] ?? 0,
            'm_tax_id' => $inputData['m_tax_id'] ?? null,
        ];
    }

    /**
     * Prepare CoursePrices Data
     *
     * @param array $mCoursePrices
     * @param int $rShopCourseId
     *
     * @return array
     */
    protected function prepareCoursePrices(array $mCoursePrices, int $rShopCourseId)
    {
        $newCoursePrices = [];

        foreach ($mCoursePrices as $mCoursePrice) {
            $newTimeBlockCreate = $this->prepareCoursePrice($mCoursePrice, $rShopCourseId);
            array_push($newCoursePrices, $newTimeBlockCreate);
        }

        return $newCoursePrices;
    }

    /**
     * Prepare Course Price Data
     *
     * @param array $mCoursePrice
     * @param int $rShopCourseId
     *
     * @return array
     */
    protected function prepareCoursePrice(array $mCoursePrice, int $rShopCourseId): array
    {
        return [
            'r_shop_course_id' => $rShopCourseId,
            'hash_id' => $this->coursePriceRepository->makeCoursePriceHashId(),
            'block_time_start' => $mCoursePrice['block_time_start'],
            'block_time_finish' => $mCoursePrice['block_time_finish'],
            'unit_price' => $mCoursePrice['unit_price'],
            'status' => $mCoursePrice['status'] ?? MCoursePrice::ACTIVE_STATUS,
            'tax_value' => $mCoursePrice['tax_value'] ?? 0,
            'm_tax_id' => $mCoursePrice['m_tax_id'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * @param integer $courseId
     * @param integer $shopId
     * @param array $listChildCourse
     * @return void
     * @throws Exception
     */
    protected function insertChildExtendCourses(int $courseId, int $shopId, array $listChildCourse)
    {
        // Prepare data for insert child extend course
        $mChildCourseData = $this->prepareMCourse($listChildCourse);
        // Make hash_id for child extend course
        $mChildCourseData['hash_id'] = $this->makeCourseHashId();
        $mChildCourseData['course_type'] = config('const.COURSE_TYPE.EXTEND_COURSE');
        $mChildCourseData['parent_id'] = $courseId;
        // Insert data child extend course
        $childCourse = $this->courseRepository->createCourse($mChildCourseData, $shopId);
        // Get data course prices of child extend course
        $mChildCoursePrices = $listChildCourse['list_course_prices'] ?? [];

        if ($childCourse && $mChildCoursePrices) {
            $newChildCoursePrices = $this->prepareCoursePrices($mChildCoursePrices, $childCourse->rShopCourse->id);

            if ($newChildCoursePrices) {
                $this->coursePriceRepository->insertCoursePrices($newChildCoursePrices);
            }
        }
    }

    /**
     * @param string $shopHashId
     * @param string $courseHashId
     * @param UploadedFile $file
     * @return bool
     * @throws Exception
     */
    public function uploadImage(string $shopHashId, string $courseHashId, UploadedFile $file): bool
    {

        $imageSizePaths = $this->imageService->resizeImages($shopHashId, $courseHashId, $file, 'course_menu');

        if (!$imageSizePaths) {
            throw new Exception('Không thể thay đổi kích thước hình ảnh');
        }

        $s3_paths = $this->imageService->s3UploadImages($shopHashId, $imageSizePaths);

        \File::delete(array_column($imageSizePaths, 'local_path'));
        $path = $this->imageService->updateImagePaths($shopHashId, $courseHashId, $s3_paths, 'course_menu');
        if (!$path) {
            throw new Exception('Error DB Save');
        }

        return true;
    }

    /**
     * @param Request $request
     * @param MCourse $course
     * @return MCourse
     * @throws Exception
     */
    public function addMenuToCourse(Request $request, MCourse $course): MCourse
    {
        $inputData = $request->all();
        // list menu in course
        $menuDatas = $inputData['list_menus'];
        $newRCourseMenus = [];

        foreach ($menuDatas as $menuData) {
            $mMenu = $this->menuRepository->getMenuByHashId($menuData['menu_hash_id']);

            if ($mMenu) {
                $newRCourseMenu = [
                    'm_menu_id' => $mMenu->id,
                    'status' => $menuData['status'] ?? MCourse::ACTIVE_STATUS,
                ];
                array_push($newRCourseMenus, $newRCourseMenu);
            }
        }

        $this->courseRepository->courseAttachMenus($course, $newRCourseMenus);

        $course->load([
            'rShopCourse' => function ($query) {
                $query->with([
                    'mCoursePrices' => function ($mCoursePriceQuery) {
                        $mCoursePriceQuery->with([
                            'mTax',
                        ])->withTrashed();
                    },
                ])->withTrashed();
            },
            'mMenus.rShopMenu.mMenuCategory' => function ($mMenuCategory) {
                $mMenuCategory->with([
                    'childCategories',
                ])->orderBy('tier_number', 'DESC');
            },
        ])->load([
            'childCourses.rShopCourse.mCoursePrices.mTax',
            'mMenus.mBusinessHourPrices.mShopBusinessHour',
            'mMenus.mImages',
            'mMenus.mainImage',
            'mMenus.rShopMenu',
        ]);

        return $course;
    }

    /**
     * @param Request $request
     * @param Mshop $shop
     * @param MCourse $course
     * @return MCourse|null
     * @throws Exception
     */
    public function updateCourse(Request $request, MShop $shop, MCourse $course): ?MCourse
    {
        try {
            DB::beginTransaction();

            $inputData = $request->all();
            // Update data main course
            $course = $this->updateDataMCourse($course, $shop->id, $inputData);

            // Delete course prices
            if ($request->has('list_delete_course_prices')) {
                $listDeleteCoursePrices = $request->list_delete_course_prices;
                foreach ($listDeleteCoursePrices as $hashId) {
                    $this->coursePriceRepository->deleteSelectedCoursePrice($hashId);
                }
            }

            // Get data course prices of main course
            $mCoursePrices = $inputData['list_course_prices'] ?? [];

            if ($course && $mCoursePrices) {
                $this->insertOrUpdateCoursePrices($course, $mCoursePrices);
            }

            // Get data list children courses
            $listChildCourses = $inputData['list_child_courses'] ?? [];

            foreach ($listChildCourses as $listChildCourse) {
                // check data m_course_price
                $courseHashId = $listChildCourse['hash_id'] ?? '';
                $courseUpdate = $this->courseRepository->getCourseByHashId($courseHashId);

                if ($courseUpdate) {
                    // Update data children courses
                    $courseUpdate = $this->updateDataMCourse($courseUpdate, $shop->id, $listChildCourse);

                    // Get data course prices of child course
                    $mChildCoursePrices = $listChildCourse['list_course_prices'] ?? [];

                    if ($mChildCoursePrices) {
                        $this->insertOrUpdateCoursePrices($courseUpdate, $mChildCoursePrices);
                    }
                } else {
                    // Insert data children courses
                    $this->insertChildExtendCourses($course->id, $shop->id, $listChildCourse);
                }
            }

            $dataCourse = $course->load([
                'childCourses',
                'mMenus.mImages',
                'mMenus.mainImage',
                'mMenus.rShopMenu'
            ]);

            if ($request->isRemoveImage) {
                $this->courseRepository->removeCourseImage($course);
            }

            if ($request->file) {
                $this->uploadImage($shop->hash_id, $course->hash_id, $request->file);
            }

            $courseResult = $this->showDetail($shop, $course);
            DB::commit();

            return $courseResult;
        } catch (Exception $e) {
            DB::rollBack();

            return null;
        }
    }

    /**
     * @param MCourse $course
     * @param integer $shopId
     * @param array $inputData
     * @return mixed
     * @throws Exception
     */
    protected function updateDataMCourse(MCourse $course, int $shopId, array $inputData)
    {
        // Prepare data for main course
        $mCourseData = $this->prepareMCourse($inputData);
        // Update data main course
        $course = $this->courseRepository->updateCourse($course, $mCourseData);
        // Check child course status
        $status = $mCourseData['status'];
        if ($course->parent_id) {
            $mainCourse = $this->courseRepository->find($course->parent_id);
            $status = $mainCourse->rShopCourse->status;
        }
        // Update status of main course if changed
        if ($course->rShopCourse->status !== $status) {
            $this->courseRepository->updateStatusCourse($course, $shopId, $status);
        }

        return $course;
    }

    /**
     * @param MCourse $course
     * @param array $mCoursePrices
     * @return void
     * @throws Exception
     */
    protected function insertOrUpdateCoursePrices(MCourse $course, array $mCoursePrices)
    {
        $newCoursePrices = [];

        foreach ($mCoursePrices as $mCoursePrice) {
            $coursePriceHashId = $mCoursePrice['hash_id'] ?? '';

            if ($coursePriceHashId) {
                $mCoursePriceUpdate = [
                    'block_time_start' => $mCoursePrice['block_time_start'],
                    'block_time_finish' => $mCoursePrice['block_time_finish'],
                    'unit_price' => $mCoursePrice['unit_price'],
                    'status' => $mCoursePrice['status'] ?? MCoursePrice::ACTIVE_STATUS,
                    'tax_value' => $mCoursePrice['tax_value'] ?? 0,
                    'm_tax_id' => $mCoursePrice['m_tax_id'] ?? null,
                ];
                $mCoursePriceModel = $this->coursePriceRepository->getCoursePriceByHashId($coursePriceHashId);
                $this->coursePriceRepository->updateCoursePrice($mCoursePriceModel, $mCoursePriceUpdate);
            } else {
                $newCoursePriceCreate = $this->prepareCoursePrice($mCoursePrice, $course->rShopCourse->id);
                $newCoursePrices[] = $newCoursePriceCreate;
            }
        }

        if ($newCoursePrices) {
            $this->coursePriceRepository->insertCoursePrices($newCoursePrices);
        }
    }

    /**
     * @param Request $request
     * @param MShop $shop
     * @param MCourse $course
     * @return MCourse
     * @throws Exception
     */
    public function updateMenuInCourse(Request $request, MShop $shop, MCourse $course): ?MCourse
    {
        try {
            DB::beginTransaction();
            $inputData = $request->all();
            // data course
            $mCourseData = [
                'name' => $inputData['name'],
                'time_block_unit' => $inputData['time_block_unit'],
            ];
            $course = $this->courseRepository->updateCourse($course, $mCourseData);

            if ($request->isRemoveImage) {
                $this->courseRepository->removeCourseImage($course);
            }

            // data menu belong to course
            $menuDatas = $inputData['list_menus'] ?? [];

            // r_course_menu table
            foreach ($menuDatas as $menuData) {
                $courseUpdate = $this->courseRepository->getCourseByHashId($menuData['course_hash_id']);
                $status = $menuData['status'] ?? MCourse::ACTIVE_STATUS;
                $mMenu = $this->menuRepository->getMenuByHashId($menuData['menu_hash_id']);

                if ($courseUpdate && $mMenu) {
                    $this->courseRepository->updateMenuInCourse($courseUpdate, $mMenu->id, $status);
                }
            }

            if ($request->file) {
                $this->uploadImage($shop->hash_id, $course->hash_id, $request->file);
            }

            $dataCourse = $course->refresh()->load([
                'rShopCourse' => function ($query) {
                    $query->with([
                        'mCoursePrices' => function ($mCoursePriceQuery) {
                            $mCoursePriceQuery->with([
                                'mTax',
                            ])->withTrashed();
                        },
                    ])->withTrashed();
                },
                'mMenus.rShopMenu.mMenuCategory' => function ($mMenuCategory) {
                    $mMenuCategory->with([
                        'childCategories',
                    ])->orderBy('tier_number', 'DESC');
                },
            ])->load([
                'childCourses.rShopCourse.mCoursePrices.mTax',
                'mMenus.mBusinessHourPrices.mShopBusinessHour',
                'mMenus.mImages',
                'mMenus.mainImage',
                'mMenus.rShopMenu',
            ]);

            DB::commit();

            return $dataCourse;
        } catch (Exception $e) {
            DB::rollBack();

            return null;
        }
    }

    /**
     * Delete course
     *
     * @param MCourse $course
     * @return mixed
     */
    public function deleteCourse(MCourse $course)
    {
        try {
            DB::beginTransaction();
            $chilExtendCourses = $course->childCourses ?? [];

            if (!empty($chilExtendCourses)) {
                foreach ($chilExtendCourses as $chilExtendCourse) {
                    $this->coursePriceRepository->deleteCoursePrice($chilExtendCourse->rShopCourse->id);
                    $this->courseRepository->deleteCourse($chilExtendCourse);
                }
            }

            $this->coursePriceRepository->deleteCoursePrice($course->rShopCourse->id);
            $this->courseRepository->deleteCourse($course);
            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();

            return null;
        }
    }

    /**
     * @param MCourse $course
     * @param MMenu   $menu
     * @return MCourse
     * @throws \Exception
     */
    public function deleteMenuInCourse(MCourse $course, MMenu $menu): MCourse
    {
        return $this->courseRepository->deleteMenuInCourse($course, $menu->id);
    }

    /**
     * @return string $hashId
     */
    public function makeCourseHashId(): string
    {
        while (true) {
            $hashId = makeHash();

            if ($this->courseRepository->isCourseHashIdDuplicated('hash_id', $hashId)) {
                break;
            }
        }

        return $hashId;
    }
}
