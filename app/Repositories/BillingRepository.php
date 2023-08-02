<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Repositories\Interfaces\BillingRepositoryInterface;
use App\Models\TServiceBilling;

class BillingRepository extends BaseRepository implements BillingRepositoryInterface
{
    /**
     * Get model
     * @return string
     */
    public function getModel(): string
    {
        return TServiceBilling::class;
    }

    /**
     * Show detail billing payment history
     *
     * @param MShop $shop
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getListHistories(MShop $shop)
    {
        return $this->model->query()
            ->with([
                'tServiceBillingDetails',
            ])
            ->where('status', '<>', TServiceBilling::UNFIXED_STATUS)
            ->where('t_service_billing.m_shop_id', $shop->id)
            ->orderBy('t_service_billing.target_month', 'DESC')
            ->orderBy('t_service_billing.start_date', 'DESC')
            ->paginate(config('const.pagination.BILLING_PAGINATION'));
    }
}
