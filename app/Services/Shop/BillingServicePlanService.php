<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Models\TServiceBilling;
use App\Models\TServiceBillingDetail;
use App\Repositories\Interfaces\BillingRepositoryInterface as BillingRepository;
use App\Repositories\Interfaces\ServicePlanRepositoryInterface as ServicePlanRepository;

class BillingServicePlanService
{
    protected $billingRepository;
    protected $servicePlanRepository;

    public function __construct(
        BillingRepository $billingRepository,
        ServicePlanRepository $servicePlanRepository
    ) {
        $this->billingRepository = $billingRepository;
        $this->servicePlanRepository = $servicePlanRepository;
    }

    /**
     * Show detail billing payment history
     *
     * @param MShop $shop
     *
     * @return array
     */
    public function showDetailHistories(MShop $shop)
    {
        $paymentHistories = $this->billingRepository->getListHistories($shop);
        $paymentDetailHistories = [
            'pagination' => [
                'total' => $paymentHistories->total(),
                'per_page' => $paymentHistories->perPage(),
                'current_page' => $paymentHistories->currentPage(),
                'last_pages' => $paymentHistories->lastPage(),
            ],
            'data' => [],
        ];

        foreach ($paymentHistories as $paymentHistory) {
            $paymentDetailHistory = $paymentHistory->toArray();
            $paymentDetailHistory['total_price'] = number_format($paymentHistory->price);
            $paymentDetailHistory['invoice_url'] = $paymentHistory->stripe_hosted_invoice_url;

            $billingDetails = $paymentHistory->tServiceBillingDetails;
            $monthlyBasicPrice = 0;
            $monthlyExtendQrPrice = 0;
            $paymentPackageName = null;

            foreach ($billingDetails as $billingDetail) {
                // Get monthly payment service name
                if ($billingDetail->service_type === TServiceBilling::SERVICE_PLAN_SERVICE_TYPE) {
                    $paymentServiceId = $billingDetail->service_id;
                    // Get payment service by id
                    $servicePlaned = $this->servicePlanRepository->find($paymentServiceId);
                    $paymentPackageName = $servicePlaned ? $servicePlaned->name : null;
                }
                // Get monthly basic price
                if ($billingDetail->fee_type === TServiceBillingDetail::PLAN_FEE_TYPE
                    || $billingDetail->fee_type === TServiceBillingDetail::INITIAL_PLAN_FEE_TYPE
                ) {
                    $monthlyBasicPrice += $billingDetail->price;
                }
                // Get monthly extend Qr price
                if ($billingDetail->fee_type === TServiceBillingDetail::EXTEND_QR_PLAN_FEE_TYPE) {
                    $monthlyExtendQrPrice += $billingDetail->price;
                }
            }
            $paymentDetailHistory['service_name'] = $paymentPackageName;
            $paymentDetailHistory['basic_price'] = number_format($monthlyBasicPrice);
            $paymentDetailHistory['extend_price'] = number_format($monthlyExtendQrPrice);
            array_push($paymentDetailHistories['data'], $paymentDetailHistory);
        }

        return $paymentDetailHistories;
    }
}
