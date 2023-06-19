<?php

namespace App\Repositories;

use App\Models\MCourse;
use App\Models\MCoursePrice;
use App\Models\RShopCourse;
use App\Repositories\Interfaces\CourseRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CourseRepository extends BaseRepository implements CourseRepositoryInterface
{
    public function getModel(): string
    {
        return MCourse::class;
    }

    /**
     * Get list of courses
     *
     * @param $shopId
     * @param $status
     * @return \Illuminate\Support\Collection|null
     */
    public function getList($shopId, $status = null): ?\Illuminate\Support\Collection
    {
        $query = $this->model->query();
        // Get relationship
        $query->with([
            'rShopCourse' => function ($rShopCourseQuery) {
                $rShopCourseQuery->with([
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
        ])->with([
            'childCourses.rShopCourse.mCoursePrices.mTax',
            'mMenus.mBusinessHourPrices.mShopBusinessHour',
            'mMenus.mImages',
            'mMenus.mainImage',
            'mMenus.rShopMenu',
        ]);
        // Get main course
        $query->where('course_type', config('const.COURSE_TYPE.MAIN_COURSE'));
        // Query select data
        $query->whereHas('rShopCourse', function ($query) use ($shopId) {
            $query->where('r_shop_course.m_shop_id', $shopId);
        });

        if ($status === MCourse::ACTIVE_STATUS || $status === MCourse::INACTIVE_STATUS) {
            $query->whereHas('rShopCourse', function ($query) use ($status) {
                $query->where('r_shop_course.status', $status);
            });
        }

        return $query->get();
    }

    /**
     * @param int $shopId
     * @param string|null $status
     * @param bool $isAvailable
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getListCourseMasterData($shopId, $status, $isAvailable): \Illuminate\Database\Eloquent\Collection
    {
        $query = $this->model->query();
        $query->whereHas('rShopCourse', function ($query) use ($shopId) {
            $query->where('r_shop_course.m_shop_id', $shopId);
        });
        $query->where('course_type', config('const.COURSE_TYPE.MAIN_COURSE'));

        if ($status === MCourse::ACTIVE_STATUS || $status === MCourse::INACTIVE_STATUS) {
            $query->whereHas('rShopCourse', function ($statusQuery) use ($status) {
                $statusQuery->where('r_shop_course.status', $status);
            });
        }
        $listCourses = $query->with('rShopCourse')->get();

        if ($isAvailable) {
            $checkTime = now()->format('H:i:s');
            $startTimeOfDay = now()->startOfDay()->format('H:i:s');
            $endTimeOfDay = now()->endOfDay()->format('H:i:s');

            $listCourses->load('rShopCourse.mCoursePrices');
            return $listCourses->filter(
                function ($course) use ($checkTime, $startTimeOfDay, $endTimeOfDay) {
                    foreach ($course->rShopCourse->mCoursePrices as $mCoursePrice) {
                        if ($mCoursePrice->status === MCoursePrice::ACTIVE_STATUS) {
                            $blockTimeStart = $mCoursePrice->block_time_start;
                            $blockTimeFinish = $mCoursePrice->block_time_finish;

                            // Course starts and ends in a working day
                            if ($blockTimeStart < $blockTimeFinish) {
                                if ($blockTimeStart <= $checkTime && $checkTime <= $blockTimeFinish) {
                                    return true;
                                }
                                continue;
                            }

                            // Course overnight
                            if ($blockTimeFinish < $blockTimeStart) {
                                if (($blockTimeStart <= $checkTime && $checkTime <= $endTimeOfDay)
                                    ||  ($startTimeOfDay <=  $checkTime && $checkTime <= $blockTimeFinish)) {
                                    return true;
                                }
                            }
                        }
                    }

                    return false;
                }
            );
        }

        return $listCourses;
    }

    /**
     * @param string $courseHashId
     * @return MCourse|null
     */
    public function getCourseByHashId(string $courseHashId): ?MCourse
    {
        return $this->model::where('hash_id', $courseHashId)->first();
    }

    /**
     * Get list of courses
     *
     * @param integer $shopId
     * @param MCourse $courseId
     *
     * @return MCourse|null
     */
    public function showDetail(int $shopId, MCourse $course): ?MCourse
    {
        // Get relationship
        return $course->load([
            'rShopCourse' => function ($query) use ($shopId) {
                $query->where('r_shop_course.m_shop_id', $shopId)->with([
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
    }

    /**
     * Create course data m_course and attach data table r_shop_course
     *
     * @param array $attributes
     * @param integer $shopId
     *
     * @return mixed
     */
    public function createCourse(array $attributes, int $shopId)
    {
        $course = $this->model->create($attributes);
        $course->mShops()->attach($shopId, ['status' => $attributes['status']]);

        return $course;
    }

    /**
     * @param string $hashId
     * @return bool
     */
    public function isCourseHashIdDuplicated(string $hashId): bool
    {
        return !MCourse::where('hash_id', $hashId)->count();
    }

    /**
     * Add menu into course
     *
     * @param MCourse $course
     * @param array $courseMenus
     *
     * @return mixed
     */
    public function courseAttachMenus(MCourse $course, array $courseMenus)
    {
        return $course->mMenus()->attach($courseMenus);
    }


    /**
     * Update course
     *
     * @param MCourse $course
     * @param array $attributes: [name, name_kana, time_block_unit, alert_notification_time]
     *
     * @return mixed
     */
    public function updateCourse(MCourse $course, array $attributes): MCourse
    {
        $course->fill($attributes)->save();

        return $course;
    }

    /**
     * Update status of course
     *
     * @param MCourse $course
     * @param integer $shopId
     * @param string $status
     *
     * @return mixed
     */
    public function updateStatusCourse(MCourse $course, int $shopId, string $status)
    {
        return $course->mShops()->updateExistingPivot($shopId, [
            'status' => $status,
            'updated_at' => now(),
        ]);
    }

    /**
     * Update menu in course
     *
     * @param MCourse $course
     * @param integer $menuId
     * @param string $status
     *
     * @return mixed
     */
    public function updateMenuInCourse(MCourse $course, int $menuId, string $status)
    {
        return $course->mMenus()->updateExistingPivot($menuId, [
            'status' => $status,
            'updated_at' => now(),
        ]);
    }

    /**
     * Remove course image in db
     *
     * @param MCourse $course
     *
     * @return boolean
     */
    public function removeCourseImage(MCourse $course): bool
    {
        if ($course->s_image_folder_path || $course->m_image_folder_path || $course->l_image_folder_path) {
            $course->s_image_folder_path = null;
            $course->m_image_folder_path = null;
            $course->l_image_folder_path = null;
            $course->save();

            return true;
        }

        return false;
    }

    /**
     * Delete course
     *
     * @param MCourse $course
     *
     * @return mixed
     */
    public function deleteCourse(MCourse $course)
    {
        RShopCourse::where('m_course_id', $course->id)->delete();
        $course->delete();

        return true;
    }

    /**
     * Delete menu in course
     *
     * @param MCourse $course
     * @param integer $menuId
     *
     * @return MCourse
     */
    public function deleteMenuInCourse(MCourse $course, int $menuId): MCourse
    {
        $course->mMenus()->detach($menuId);

        return $course->load([
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
    }
}
