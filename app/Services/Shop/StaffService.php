<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Repositories\Interfaces\StaffRepositoryInterface as StaffRepository;
use Illuminate\Http\Request;

class StaffService
{
    protected $staffRepository;

    public function __construct(StaffRepository $staffRepository)
    {
        $this->staffRepository = $staffRepository;
    }

    /**
     * Get list staffs of shop
     * @param Request $request
     * @param MShop $shop
     *
     * @return Collection
     */
    public function getListOfShop(Request $request, MShop $shop)
    {
        $perPage = $request->get('per_page', config('const.pagination.STAFFS_PAGINATION'));

        return $this->staffRepository->getListOfShop($shop, $perPage);
    }
}
