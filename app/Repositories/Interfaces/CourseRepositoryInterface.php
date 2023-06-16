<?php

namespace App\Repositories\Interfaces;

use App\Models\MCourse;

interface CourseRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get list of courses
     *
     * @param integer $shopId
     * @param string  $status
     *
     * @return \Illuminate\Support\Collection
     */
    public function getList($shopId, $status = null);

    /**
     * Get course by hash_id
     *
     * @param string $courseHashId
     *
     * @return MCourse|null
     */
    public function getCourseByHashId(string $courseHashId);

    /**
     * Show detail course menu
     *
     * @param integer $shopId
     * @param integer $courseId
     *
     * @return MCourse|null
     */
    public function showDetail(int $shopId, MCourse $course);

    /**
     * Check duplicate hash_id
     *
     * @param string $hashId
     *
     * @return bool
     */
    public function isCourseHashIdDuplicated(string $hashId);

    /**
     * Create course and setting time block in course
     *
     * @param array   $attributes
     * @param integer $shopId
     *
     * @return mixed
     */
    public function createCourse(array $attributes, int $shopId);

    /**
     * Add menu into course
     *
     * @param MCourse $course
     * @param array $courseMenus
     *
     * @return mixed
     */
    public function courseAttachMenus(MCourse $course, array $courseMenus);
}
