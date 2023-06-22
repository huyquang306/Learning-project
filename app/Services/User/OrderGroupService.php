<?php

namespace App\Services\User;

use App\Models\TOrderGroup;
use App\Repositories\MenuRepository;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class OrderGroupService
{
    protected $orderGroupRepository;
    protected $orderRepository;
    protected $menuRepository;

    public function __construct(
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository,
        MenuRepository $menuRepository
    ) {
        $this->orderGroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
        $this->menuRepository = $menuRepository;
    }

    /**
     * Get status of order groups
     *
     * @param TOrderGroup $ordergroup
     * @return TOrderGroup
     */
    public function getOrderGroup(TOrderGroup $ordergroup): TOrderGroup
    {
        return $ordergroup->load('tOrders.rShopCourse.mCourse');
    }
}
