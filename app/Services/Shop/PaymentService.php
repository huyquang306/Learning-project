<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Models\RShopStaff;
use App\Models\TStripeCustomer;
use App\Repositories\Interfaces\StaffRepositoryInterface;
use App\Repositories\ShopRepository;
use Stripe\Customer;
use Stripe\Exception\ApiErrorException;
use Stripe\SetupIntent;
use Illuminate\Http\Request;

class PaymentService
{
    protected $shopRepository;
    protected $staffRepository;

    public function __construct(ShopRepository $shopRepository, StaffRepositoryInterface $staffRepository)
    {
        $this->staffRepository = $staffRepository;
        $this->shopRepository = $shopRepository;
    }

    /**
     * @throws ApiErrorException
     * @return mixed
     */
    public function getCustomerPayment(MShop $shop)
    {
        $staffAuthorisePay = $this->shopRepository->getStaffAuthorisePayment($shop);
        if ($staffAuthorisePay && $staffAuthorisePay->tStripeCustomer) {
            return Customer::retrieve($staffAuthorisePay->tStripeCustomer->stripe_customer_id, []);
        }

        return null;
    }

    /**
     * @throws ApiErrorException
     * @return mixed
     */
    public function createOrUpdateCustomerPayment(Request $request, MShop $shop)
    {
        $customerData = $request->only([
            'name',
            'zip_code',
            'address',
            'phone',
            'email',
        ]);
        // Check shop has staff register payment
        $staffAuthorisePay = $this->shopRepository->getStaffAuthorisePayment($shop);

        // Case: Update customer information
        if ($staffAuthorisePay && $staffAuthorisePay->tStripeCustomer) {
            $stripeCustomerId = $staffAuthorisePay->tStripeCustomer->stripe_customer_id;

            return Customer::update($stripeCustomerId, [
                'name' => $customerData['name'] ?? null,
                'email' => $customerData['email'] ?? null,
                'phone' => $customerData['phone'] ?? null,
                'metadata' => [
                    'shop_hash_id' => $shop->hash_id,
                    'shop_id' => $shop->id,
                    'shop_name' => $shop->name,
                    'shop_address' => $shop->address,
                    'zip_code' => $customerData['zip_code'],
                    'address' => $customerData['address'],
                ],
                'description' => $shop->name,
            ]);
        }

        // Case: Create a customer
        // Shop have not authorized staff payment yet
        $sAccountStaff = auth()->user()->load('mStaff.tStripeCustomer');
        $staff = $sAccountStaff->mStaff;
        // Check current staff registered customer payment
        if ($staff->tStripeCustomer) {
            $customerPayment = Customer::retrieve($staff->tStripeCustomer->stripe_customer_id, []);
        } else {
            // Create a new customer stripe with email
            $customerPayment = Customer::create([
                'name' => $customerData['name'] ?? null,
                'email' => $customerData['email'] ?? null,
                'phone' => $customerData['phone'] ?? null,
                'metadata' => [
                    'shop_hash_id' => $shop->hash_id,
                    'shop_id' => $shop->id,
                    'shop_name' => $shop->name,
                    'shop_address' => $shop->address,
                    'zip_code' => $customerData['zip_code'] ?? null,
                    'address' => $customerData['address'] ?? null,
                ],
                'description' => $shop->name,
            ]);
            $staff->tStripeCustomer()->create([
                'stripe_customer_id' => $customerPayment->id,
            ]);
        }
        // Active current staff to payment
        $shop->mStaffs()->sync([
            $staff->id => [
                'is_staff_pay' => RShopStaff::IS_STAFF_PAY,
            ]
        ]);

        return $customerPayment;
    }

    /**
     * @throws ApiErrorException
     * @return mixed
     */
    public function setupIntent(MShop $shop)
    {
        $staffAuthorisePay = $this->shopRepository->getStaffAuthorisePayment($shop);
        if ($staffAuthorisePay && $staffAuthorisePay->tStripeCustomer) {
            $customer = Customer::retrieve($staffAuthorisePay->tStripeCustomer->stripe_customer_id, []);

            return SetupIntent::create([
                'customer' => $customer->id,
                'payment_method_types' => ['card'],
            ]);
        }

        return null;
    }

    public function registerPaymentMethod(MShop $shop, string $paymentMethod): bool
    {
        $staffAuthorisePay = $this->shopRepository->getStaffAuthorisePayment($shop);
        if ($staffAuthorisePay) {
            $staffAuthorisePay->tStripeCustomer
                ->update([
                    'payment_method' => $paymentMethod,
                ]);

            return true;
        }

        return false;
    }

    /**
     * @throws ApiErrorException
     * @return mixed
     */
    public function activeCard(Request $request, MShop $shop)
    {
        $staffAuthorisePay = $this->shopRepository->getStaffAuthorisePayment($shop);
        if ($staffAuthorisePay && $staffAuthorisePay->tStripeCustomer) {
            $customer = Customer::retrieve($staffAuthorisePay->tStripeCustomer->stripe_customer_id, []);

            return Customer::update($customer->id, [
                'invoice_settings' => [
                    'default_payment_method' => $request->payment_method_id,
                ],
            ]);
        }

        return null;
    }
}
