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
     * @return \Illuminate\Support\Collection|null
     */
    public function getList($shopId, $status = null): ?\Illuminate\Support\Collection;

    /**
     * Get course by hash_id
     *
     * @param string $courseHashId
     *
     * @return MCourse|null
     */
    public function getCourseByHashId(string $courseHashId): ?MCourse;

    /**
     * Show detail course menu
     *
     * @param integer $shopId
     * @param MCourse $course
     * @return MCourse|null
     */
    public function showDetail(int $shopId, MCourse $course): ?MCourse;

    /**
     * Check duplicate hash_id
     *
     * @param string $hashId
     *
     * @return bool
     */
    public function isCourseHashIdDuplicated(string $hashId): bool;

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

    /**
     * Update course menu
     *
     * @param MCourse $course
     * @param array   $attributes
     *
     * @return MCourse
     */
    public function updateCourse(MCourse $course, array $attributes): MCourse;

    /**
     * Update status of course
     *
     * @param MCourse $course
     * @param integer $shopId
     * @param string $status
     *
     * @return mixed
     */
    public function updateStatusCourse(MCourse $course, int $shopId, string $status);

    /**
     * Remove course image in db
     *
     * @param MCourse $course
     *
     * @return boolean
     */
    public function removeCourseImage(MCourse $course): bool;

    /**
     * Update menu in course
     *
     * @param MCourse $course
     * @param integer $menuId
     * @param string $status
     *
     * @return mixed
     */
    public function updateMenuInCourse(MCourse $course, int $menuId, string $status);

    /**
     * Delete course
     *
     * @param MCourse $course
     *
     * @return mixed
     */
    public function deleteCourse(MCourse $course);

    /**
     * Delete menu in course
     *
     * @param MCourse $course
     * @param integer $menuId
     *
     * @return MCourse
     */
    public function deleteMenuInCourse(MCourse $course, int $menuId): MCourse;
}
