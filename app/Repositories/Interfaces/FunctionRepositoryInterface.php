<?php

namespace App\Repositories\Interfaces;

use App\Models\MServicePlan;
use App\Models\MShop;

interface FunctionRepositoryInterface extends BaseRepositoryInterface
{
    public function getFunctionDataAdmin();
}
