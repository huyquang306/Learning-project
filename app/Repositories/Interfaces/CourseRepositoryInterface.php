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
}
