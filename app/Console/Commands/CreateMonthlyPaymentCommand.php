<?php

namespace App\Console\Commands;

use App\Services\Shop\OrderGroupService;
use App\Services\Shop\PaymentService;
use App\Services\Shop\StaffService;
use App\Services\ShopService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Customer;

class CreateMonthlyPaymentCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create-monthly-payment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create monthly payment';

    private $shopService;
    private $staffService;
    private $orderGroupService;
    private $paymentService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        ShopService $shopService,
        StaffService $staffService,
        OrderGroupService $orderGroupService,
        PaymentService $paymentService
    )
    {
        $this->shopService = $shopService;
        $this->staffService = $staffService;
        $this->orderGroupService = $orderGroupService;
        $this->paymentService = $paymentService;
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $listShop = $this->shopService->getListShopWithPaymentInfo();
        foreach ($listShop as $shop) {
            $servicePlanInitialPrice = 0;
            $totalQR = 0;
            $stripeCustomerId = '';
            $limitQR = 0;
            $extendPrice = 0;

            if ($shop->mServicePlans->first()) {
                $servicePlan = $shop->mServicePlans->first();
                $servicePlanInitialPrice = $servicePlan->price;
                if (!$servicePlanInitialPrice) continue;
                foreach ($servicePlan->rFunctionConditions as $item) {
                    if ($item->m_function_id === 1) {
                        $limitQR = $item->restricted_value;
                        $extendPrice = $item->mFunction
                            ->where("code", "=", "qr")
                            ->first()
                            ->mServicePlanOptions
                            ->where('m_service_plan_id', "=", $servicePlan->id)
                            ->first()
                            ->additional_price;
                    }
                }
            } else {
                continue;
            }

            if ($shop->tOrderGroupsInLastMonth) {
                $totalQR = $shop->tOrderGroupsInLastMonth->count();
            }

            if ($shop->mStaffsCanPay->first() && $shop->mStaffsCanPay->first()->tStripeCustomer) {
                $stripeCustomerId = $shop->mStaffsCanPay->first()->tStripeCustomer->stripe_customer_id;
                if (!$stripeCustomerId) continue;
            }

            if ($totalQR > $limitQR) {
                $extendPrice = ($totalQR - $limitQR) * $extendPrice;
            }
            $totalPrice = $servicePlanInitialPrice + $extendPrice;


            try {
                $customer = Customer::retrieve($stripeCustomerId, []);
                $paymentIntent = PaymentIntent::create([
                    'amount' => $totalPrice,
                    'currency' => 'VND',
                    'customer' => $stripeCustomerId,
                    'payment_method' => $customer->invoice_settings->default_payment_method,
                    'description' => 'EzOrder monthly payment',
                    'confirm' => true,
                ]);
            } catch (\Stripe\Exception\ApiErrorException $exception) {
                Log::critical($exception->getMessage());
            }
        }
    }
}
