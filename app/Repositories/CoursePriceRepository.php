<?php

namespace App\Repositories;

use App\Models\MCoursePrice;
use App\Repositories\Interfaces\CoursePriceRepositoryInterface;

class CoursePriceRepository extends BaseRepository implements CoursePriceRepositoryInterface
{

    public function getModel(): string
    {
        return MCoursePrice::class;
    }

    /**
     * Insert time blocks and prices in course
     *
     * @param array $mCoursePrices
     *
     * @return mixed
     */
    public function insertCoursePrices(array $mCoursePrices)
    {
        return $this->model::insert($mCoursePrices);
    }

    /**
     * Get m_course_price by hash_id
     *
     * @param string $coursePriceHashId
     *
     * @return MCoursePrice|null
     */
    public function getCoursePriceByHashId(string $coursePriceHashId): ?MCoursePrice
    {
        return $this->model::where('hash_id', $coursePriceHashId)->first();
    }

    /**
     * Update time blocks and prices in course
     *
     * @param MCoursePrice $mCoursePrice
     * @param array $dataCoursePrices
     *
     * @return mixed
     */
    public function updateCoursePrice(MCoursePrice $mCoursePrice, array $dataCoursePrices)
    {
        return $mCoursePrice->fill($dataCoursePrices)->save();
    }

    /**
     * @return string $hashId
     */
    public function makeCoursePriceHashId(): string
    {
        while (true) {
            $hashId = makeHash();
            $isDuplicate  = !$this->model::where('hash_id', $hashId)->count();
            if ($isDuplicate) {
                break;
            }
        }
        return $hashId;
    }

    /**
     * Delete list course price
     *
     * @param string $hashId
     * @return mixed
     */
    public function deleteSelectedCoursePrice(string $hashId)
    {
        return $this->model::where('hash_id', $hashId)->forceDelete();
    }

    /**
     * Delete m_course_price by r_shop_course_id
     *
     * @param integer $rShopCourseId
     *
     * @return mixed
     */
    public function deleteCoursePrice(int $rShopCourseId)
    {
        return $this->model::where('r_shop_course_id', $rShopCourseId)->delete();
    }
}