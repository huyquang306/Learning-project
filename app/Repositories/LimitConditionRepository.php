<?php

namespace App\Repositories;

use App\Models\MLimitCondition;

class LimitConditionRepository extends BaseRepository
{
    /**
     * get model
     * @return string
     */
    public function getModel(): string
    {
        return MLimitCondition::class;
    }
}
