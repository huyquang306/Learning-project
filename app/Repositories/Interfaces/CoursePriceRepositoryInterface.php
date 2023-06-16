<?php

namespace App\Repositories\Interfaces;

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
}
