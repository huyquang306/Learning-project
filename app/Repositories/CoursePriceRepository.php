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

}