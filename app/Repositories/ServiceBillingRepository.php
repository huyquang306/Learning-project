<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\TServiceBilling;
use App\Models\TServiceBillingDetail;
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
    public function updateServiceBilling(TServiceBilling $serviceBilling, array $data): TServiceBilling
    {
        $serviceBilling->status = $data['status'];
        $serviceBilling->stripe_hosted_invoice_url = $data['invoice_url'];
        $serviceBilling->stripe_invoice_pdf = $data['invoice_pdf'];
        $serviceBilling->log = $serviceBilling->log . $data['log'];
        $serviceBilling->save();

        $serviceBilling->tServiceBillingDetails->first()->update([
            'status' => $data['status'],
        ]);

        return $serviceBilling;
    }

    public function createMonthlyServiceBilling($data)
    {
        while (true) {
            $hashId = makeHash();
            if (!$this->model->where('hash_id', $hashId)->count()) {
                break;
            }
        }

        $serviceBilling = $this->model->create([
            'hash_id' => $hashId,
            'buyer_id' => $data['buyer_id'],
            'buyer_type' => TServiceBilling::SHOP_BUYER_TYPE,
            'm_shop_id' => $data['shop_id'],
            'stripe_payment_id' => $data['stripe_payment_id'],
            'price' => $data['price'],
            'payment_method' => $data['payment_method'],
            'status' => $data['status'],
            'total_qr_number' => $data['total_qr_number'],
            'extend_qr_number' => $data['extend_qr_number'],
            'start_date' => now('Asia/Ho_Chi_Minh')->subMonth()->startOfMonth(),
            'end_date' => now('Asia/Ho_Chi_Minh')->subMonth()->endOfMonth(),
            'target_month' => now('Asia/Ho_Chi_Minh')->subMonth(),
        ]);

        $serviceBilling->tServiceBillingDetails()->create([
            'hash_id' => $hashId,
            'service_id' => $data['service_plan_id'],
            'service_type' => TServiceBilling::SERVICE_PLAN_SERVICE_TYPE,
            'name' => 'Phí dịch vụ tháng ' . now('Asia/Ho_Chi_Minh')->subMonth(),
            'price' => $data['price'],
            'type' => TServiceBillingDetail::PLAN_FEE_TYPE,
            'status' => $data['status']
        ]);

        return $serviceBilling;
    }
}
