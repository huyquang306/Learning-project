<?php

namespace App\Repositories\Interfaces;

use App\Models\MCoursePrice;

interface CoursePriceRepositoryInterface
{
    /**
     * Insert time blocks and prices in course
     *
     * @param array $mCoursePrices
     *
     * @return mixed
     */
    public function insertCoursePrices(array $mCoursePrices);

    /**
     * make course price hash_id
     *
     * @return string $hashId
     */
    public function makeCoursePriceHashId(): string;

    /**
     * Get m_course_price by hash_id
     *
     * @param string $coursePriceHashId
     *
     * @return MCoursePrice|null
     */
    public function getCoursePriceByHashId(string $coursePriceHashId): ?MCoursePrice;

    /**
     * Update time blocks and prices in course
     *
     * @param MCoursePrice $mCoursePrice
     * @param array $dataCoursePrices
     *
     * @return mixed
     */
    public function updateCoursePrice(MCoursePrice $mCoursePrice, array $dataCoursePrices);

    /**
     * @param string $hashId
     * @return mixed
     */
    public function deleteSelectedCoursePrice(string $hashId);

    /**
     * Delete m_course_price by r_shop_course_id
     *
     * @param integer $rShopCourseId
     *
     * @return mixed
     */
    public function deleteCoursePrice(int $rShopCourseId);
}
