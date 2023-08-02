<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;
use Stripe\Stripe;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Cashier::ignoreMigrations();
        Stripe::setApiKey(config('stripe.secret_key'));
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if (request()->isSecure()) {
            \URL::forceScheme('https');
        }

        $repositories = [
            'SConfigurationRepositoryInterface' => 'SConfigurationRepository',
            'TmpShopRepositoryInterface' => 'TmpShopRepository',
            'StaffRepositoryInterface' => 'StaffRepository',
            'MImageRepositoryInterface' => 'MImageRepository',
            'CourseRepositoryInterface' => 'CourseRepository',
            'AnnouncementRepositoryInterface' => 'AnnouncementRepository',
            'ShopMetaRepositoryInterface' => 'ShopMetaRepository',
            'CoursePriceRepositoryInterface' => 'CoursePriceRepository',
            'ShopCookPlaceRepositoryInterface' => 'ShopCookPlaceRepository',
            'ShopPosSettingRepositoryInterface' => 'ShopPosSettingRepository',
            'BusinessHourRepositoryInterface' => 'BusinessHourRepository',
            'PaymentMethodForCusRepositoryInterface' => 'PaymentMethodForCusRepository',
            'TPaymentRepositoryInterface' => 'TPaymentRepository',
            'UserRepositoryInterface' => 'UserRepository',
            'ServiceBillingRepositoryInterface' => 'ServiceBillingRepository',
            'FunctionRepositoryInterface' => 'FunctionRepository',
            'ServicePlanRepositoryInterface' => 'ServicePlanRepository',
            'RFunctionConditionRepositoryInterface' => 'RFunctionConditionRepository',
            'UserHistoryRepositoryInterface' => 'UserHistoryRepository',
            'BillingRepositoryInterface' => 'BillingRepository',

        ];

        foreach ($repositories as $key => $val) {
            $this->app->singleton("App\\Repositories\\Interfaces\\$key", "App\\Repositories\\$val");
        }
    }
}
