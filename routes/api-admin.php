<?php

Route::prefix('v1')->group(function () {
    Route::group([
        'domain' => config('app.admin_domain'),
        'namespace' => 'Api\Admin',
        'middleware' => ['domain.admin_domain'],
    ], function () {
        // billings
        Route::get('shops/{shop}/billings', 'BillingController@index');

        // customer payment
        Route::get('shops/{shop}/customer-payment', 'ShopController@getCustomerPayment');

        // update shop servicePlan
        Route::post('shops/{shop}/service-plan', 'ShopController@updateShopServicePlan');

        // Cancel/reopen shop
        Route::post('shops/{shop}/cancel', 'ShopController@cancelShop');
        Route::post('shops/{shop}/reopen', 'ShopController@reopenShop');

        Route::get('shops/{shop}', 'ShopController@show');
        Route::get('shops', 'ShopController@index');

        // service plans
        Route::resource('service-plans', 'ServicePlanController')->except(['create', 'show', 'edit']);
        Route::get('functions', 'FunctionController@index');
    });
});