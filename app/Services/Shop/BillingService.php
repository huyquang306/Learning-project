<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Models\MShopPosSetting;
use App\Models\TOrder;
use App\Models\TOrderGroup;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use App\Repositories\Interfaces\TPaymentRepositoryInterface as TPaymentRepository;
use Illuminate\Http\Request;

class BillingService
{
    protected $orderGroupRepository;
    protected $orderRepository;
    protected $servicePlanRepository;
    protected $tPaymentRepository;

    public function __construct(
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository,
        TPaymentRepository $tPaymentRepository
    ) {
        $this->orderGroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
        $this->tPaymentRepository = $tPaymentRepository;
    }

    /**
     * Checkout ordergroup
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function payRequest(MShop $shop, TOrderGroup $ordergroup)
    {
        $ordergroupData = $ordergroup->toArray();
        $ordergroupId = $ordergroup->id;
        $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.REQUEST_CHECKOUT');

        $ordergroup = $this->orderGroupRepository->updateOrderGroup($ordergroupId, $ordergroupData);

        return $ordergroup->load(
            $this->orderGroupRepository->queryGetOrdersDataOfOrderGroup()
        );
    }

    /**
     * Finish billing table
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function finishBilling(MShop $shop, TOrderGroup $ordergroup = null)
    {
        $ordergroupId = $ordergroup->id;
        $ordergroupData = $ordergroup->toArray();
        $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.CHECKED_OUT');
        $ordergroupData['order_blocked'] = 0;

        return $this->orderGroupRepository->updateOrderGroup($ordergroupId, $ordergroupData);
    }

    /**
     * Paying
     *
     * @param MShop $shop
     * @param TOrderGroup $ordergroup
     * @param bool $flagUpdate
     * @return mixed
     */
    public function paying(MShop $shop, TOrderGroup $ordergroup, $flagUpdate)
    {
        $ordergroupId = $ordergroup->id;
        $ordergroupData = $ordergroup->only([
            'status',
            'order_blocked',
            'count',
            'total_billing',
            'payment_request_time',
            'number_of_customers',
        ]);

        if ($flagUpdate) {
            $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.WAITING_CHECKOUT');
        } else {
            $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.ORDERING');
            // Re-caculate the number of extend course times after re-open waitting checkout for order
            $this->calculateExtendCourseTimes($ordergroup);
        }

        return $this->orderGroupRepository->updateOrderGroup($ordergroupId, $ordergroupData);
    }

    /**
     * Re-caculate the number of extend course times
     *
     * @param TOrderGroup $ordergroup
     * @return mixed
     */
    public function calculateExtendCourseTimes(TOrderGroup $ordergroup)
    {
        return $this->orderRepository->calculateExtendCourseTimes($ordergroup);
    }

    /**
     * Payment OrderGroup
     * @param MShop       $shop
     * @param Request     $request
     * @param TOrderGroup $ordergroup
     *
     * @return mixed
     */
    public function payment(MShop $shop, Request $request, TOrderGroup $ordergroup)
    {
        $ordergroupData['status'] = config('const.STATUS_ORDERGROUP.CHECKED_OUT');
        $ordergroupData['count'] = $request->count ?? 0;

        if ($request->total_billing) {
            $ordergroupData['total_billing'] = $request->total_billing;
            $this->saveServeChargeServiceOrder(
                $ordergroup,
                $request->serve_charge_price ?? 0,
                $request->serve_charge_tax_value ?? 0,
                $request->serve_charge_tax_rate ?? 0
            );
        } else {
            $ordergroupData['total_billing'] = $this->sumTotalBilling($shop, $ordergroup);
        }

        $this->savePaymentInformation($ordergroup, $request);

        // Update billing
        $this->orderGroupRepository->updateOrderGroup($ordergroup->id, $ordergroupData);

        return $ordergroup->refresh()->load([
            'tPayment.tPaymentMethods.mPaymentMethod',
            'tOrders.rShopMenu.mMenu',
            'tOrders.rShopCourse.mCourse',
        ]);
    }

    /**
     * Save serve charge service order
     * @param TOrderGroup $ordergroup
     * @param int         $serveChargePrice
     * @param int         $serveChargeTaxValue
     * @param float       $serveChargeTaxRate
     *
     * @return mixed
     */
    protected function saveServeChargeServiceOrder(
        TOrderGroup $ordergroup,
        int $serveChargePrice,
        int $serveChargeTaxValue,
        float $serveChargeTaxRate
    ) {
        if ($serveChargePrice) {
            $taxOrder = [
                't_ordergroup_id' => $ordergroup->id,
                'order_type' => TOrder::SERVICE_FEE_TYPE_VALUE,
                'status' => config('const.STATUS_FINISH'),
                'price_unit' => $serveChargePrice,
                'amount' => $serveChargePrice,
                'tax_value' => $serveChargeTaxValue,
                'tax_rate' => $serveChargeTaxRate,
                'quantity' => 1,
                'ordered_at' => now(),
            ];

            // Create a new tax to t_order
            return $this->orderRepository->updateOrCreate([
                'order_type' => TOrder::SERVICE_FEE_TYPE_VALUE,
                't_ordergroup_id' => $ordergroup->id,
            ], $taxOrder);
        }


        return false;
    }

    /**
     * Sum total billing
     * @param MShop       $shop
     * @param TOrderGroup $ordergroup
     *
     * @return float
     */
    protected function sumTotalBilling(MShop $shop, TOrderGroup $ordergroup)
    {
        $totalBilling = $this->sumTotalOrdersAmount($ordergroup);

        // Get serve service
        $serveChargeValue = $this->calculateServeChargeByTotalBilling($shop, $totalBilling);
        if ($serveChargeValue['price'] > 0) {
            // Create a new tax to t_order
            $this->saveServeChargeServiceOrder(
                $ordergroup,
                $serveChargeValue['price'],
                $serveChargeValue['tax_value'],
                $serveChargeValue['tax_rate']
            );
            $totalBilling += $serveChargeValue['price'];

            // Round total amount
            $shop->load('mShopPosSetting');
            $taxOption = $shop->mShopPosSetting;
            $amountFractionMode = $taxOption
                ? $taxOption->total_amount_fraction_mode
                : 0;
            if ($amountFractionMode) {
                $totalBilling = floor($totalBilling / 10) * 10;
            }
        }

        return $totalBilling;
    }

    /**
     * Sum total orders price
     * @param TOrderGroup $ordergroup
     *
     * @return mixed
     */
    protected function sumTotalOrdersAmount(TOrderGroup $ordergroup)
    {
        $totalBilling = 0;
        if (count($ordergroup->tOrders)) {
            $orders = $ordergroup->tOrders;

            foreach ($orders as $order) {
                if ($order->status != config('const.STATUS_CANCEL')) {
                    $totalBilling += $order->amount;
                }
            }
        }

        return $totalBilling;
    }

    /**
     * Calculate serve charge by total billing
     * @param MShop $shop
     * @param int   $totalBilling
     *
     * @return array
     */
    protected function calculateServeChargeByTotalBilling(MShop $shop, int $totalBilling): array
    {
        $taxRate = TOrder::SERVICE_FEE_TAX_RATE;
        $serveChargeTax = 0;
        $serveChargeWithTax = 0;

        $shop->load('mShopPosSetting');
        $taxOption = $shop->mShopPosSetting;
        $priceFractionMode = $taxOption
            ? $taxOption->price_fraction_mode
            : MShopPosSetting::ROUND_DOWN_PRICE_FRACTION_MODE;
        if ($taxOption && $taxOption->serve_charge_in_use && $taxOption->serve_charge_rate) {
            $serveCharge = roundPrice($priceFractionMode, $taxOption->serve_charge_rate * $totalBilling);
            $serveChargeTax = roundPrice($priceFractionMode, $serveCharge * $taxRate);
            $serveChargeWithTax = $serveCharge + $serveChargeTax;
        }

        return [
            'tax_rate' => $taxRate,
            'tax_value' => $serveChargeTax,
            'price' => $serveChargeWithTax,
        ];
    }

    /**
     * Save customer payment information
     * @param TOrderGroup $ordergroup
     * @param Request $request
     *
     * @return boolean
     */
    protected function savePaymentInformation(TOrderGroup $ordergroup, Request $request): bool
    {
        $paymentData = $request->t_payment;
        if (!$paymentData) {
            return false;
        }

        $paymentData['t_ordergroup_id'] = $ordergroup->id;
        $this->tPaymentRepository->savePaymentsInformation($paymentData);

        return true;
    }
}
