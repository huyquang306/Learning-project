<?php

namespace App\Repositories;

use App\Models\MFunction;
use App\Repositories\Interfaces\FunctionRepositoryInterface;

class FunctionRepository extends BaseRepository implements FunctionRepositoryInterface
{
    /**
     * get model
     * @return string
     */
    public function getModel(): string
    {
        return MFunction::class;
    }

    public function getFunctionDataAdmin()
    {
        return $this->model
            ->with('rFunctionConditions.mConditionType')
            ->get();
    }
}
