<?php

namespace App\Repositories;

use App\Models\RServicePlanCondition;

class ServicePlanConditionRepository extends BaseRepository
{
    /**
     * get model
     * @return string
     */
    public function getModel(): string
    {
        return RServicePlanCondition::class;
    }
}
