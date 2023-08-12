<?php

namespace App\Console\Commands;

use App\Models\TPaymentMethod;
use App\Models\TServiceBilling;
use App\Services\Admin\TServiceBillingService;
use App\Services\Shop\OrderGroupService;
use App\Services\Shop\PaymentService;
use App\Services\Shop\StaffService;
use App\Services\ShopService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Invoice;
use Stripe\InvoiceItem;
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
    private $billingService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        ShopService $shopService,
        StaffService $staffService,
        OrderGroupService $orderGroupService,
        PaymentService $paymentService,
        TServiceBillingService $billingService
    )
    {
        $this->shopService = $shopService;
        $this->staffService = $staffService;
        $this->orderGroupService = $orderGroupService;
        $this->paymentService = $paymentService;
        $this->billingService = $billingService;
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
                $shopStaffId = $shop->mStaffsCanPay->first()->id;
                $stripeCustomerId = $shop->mStaffsCanPay->first()->tStripeCustomer->stripe_customer_id;
                if (!$stripeCustomerId) continue;
            }

            if ($totalQR > $limitQR) {
                $extendPrice = ($totalQR - $limitQR) * $extendPrice;
            }
            $totalPrice = $servicePlanInitialPrice + $extendPrice;

            try {
                $invoice = Invoice::create([
                    'customer' => $stripeCustomerId,
                    'auto_advance' => true,
                    'collection_method' => 'charge_automatically',
                ]);
                $invoiceItem = InvoiceItem::create([
                    'customer' => $stripeCustomerId,
                    'invoice' => $invoice->id,
                    'amount' => 500000,
                    'currency' => 'VND',
                    'description' => 'EzOrder monthly payment',
                ]);

                DB::beginTransaction();
                $data = [
                    'buyer_id' => $shopStaffId ?? $shop->id,
                    'shop_id' => $shop->id,
                    'stripe_payment_id' => $invoice->id,
                    'price' => $totalPrice,
                    'payment_method' => $shop->mPaymentMethods->first() ? $shop->mPaymentMethods->first()->id : 1,
                    'status' => TServiceBilling::OPEN_STATUS,
                    'total_qr_number' => $totalQR,
                    'extend_qr_number' => $totalQR - $limitQR,
                    'service_plan_id' => $shop->mServicePlans->first()->id,
                ];

                $this->billingService->createMonthlyBilling($data);
                DB::commit();
            } catch (\Stripe\Exception\ApiErrorException $exception) {
                Log::critical($exception->getMessage());
            } catch (\Exception $exception) {
                DB::rollBack();
                Log::critical($exception->getMessage());
            }
        }
    }
}
