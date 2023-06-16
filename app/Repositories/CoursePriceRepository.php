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
}