<?php

namespace App\Repositories;

use App\Models\MImage;
use App\Repositories\Interfaces\MImageRepositoryInterface;

class MImageRepository extends BaseRepository implements MImageRepositoryInterface
{

    /**
     * @return string
     */
    public function getModel(): string
    {
        return MImage::class;
    }
}
