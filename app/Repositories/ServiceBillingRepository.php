<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\TServiceBilling;
use App\Repositories\Interfaces\ServiceBillingRepositoryInterface;

class ServiceBillingRepository extends BaseRepository implements ServiceBillingRepositoryInterface
{
    public function getModel(): string
    {
        return TServiceBilling::class;
    }

    /**
     * @param MShop $shop
     * @return mixed
     */
    public function getShopBillingsPagination(MShop $shop)
    {
        return $this->model->where('m_shop_id', $shop->id)->with([
            'tServiceBillingDetails',
            'mShop.tOrderGroups.tOrders',
        ])
            ->orderBy('target_month', 'DESC')
            ->orderBy('start_date', 'DESC')
            ->paginate(config('const.pagination.admin.billings_pagination'));
    }

    /**
     * @param string $stripeId
     * @return mixed
     */
    public function getBillingById(string $stripeId)
    {
        return $this->model->where('stripe_payment_id', $stripeId)
            ->with('tServiceBillingDetails')
            ->first();
    }

    /**
     * @param TServiceBilling $serviceBilling
     * @param int $status
     * @param string $log
     * @return TServiceBilling
     */
    public function updateServiceBillingStatus(TServiceBilling $serviceBilling, int $status, string $log = ''): TServiceBilling
    {
        $serviceBilling->status = $status;
        $serviceBilling->log = $serviceBilling->log . $log;
        $serviceBilling->save();

        $serviceBilling->tServiceBillingDetails->update([
            'status' => $status,
        ]);

        return $serviceBilling;
    }
}
