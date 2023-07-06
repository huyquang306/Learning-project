<?php

namespace App\Repositories;

use App\Models\RFunctionCondition;
use App\Repositories\Interfaces\RFunctionConditionRepositoryInterface;

class RFunctionConditionRepository extends BaseRepository implements RFunctionConditionRepositoryInterface
{
    /**
     * get model
     * @return string
     */
    public function getModel(): string
    {
        return RFunctionCondition::class;
    }
}
