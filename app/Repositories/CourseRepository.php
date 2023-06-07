<?php

namespace App\Repositories;

use App\Models\MCourse;
use App\Models\MCoursePrice;
use App\Repositories\Interfaces\CourseRepositoryInterface;

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
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Support\Collection
     */
    public function getList($shopId, $status = null)
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
}
