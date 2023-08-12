<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Routes for main site
Route::group([
//    'domain' => config('app.main_domain'),
    'middleware' => [
        'domain.main_domain',
    ],
], function () {
    Route::get(config('react.index_path_shop_manage') . '/{path?}', function () {
        return view('shop');
    })->where('path', '.*');

    Route::get(config('react.index_path_customer_manage') . '/{path?}', function () {
        return view('customer');
    })->where('path', '.*');
});

// Routes for order site
Route::group([
//    'domain' => config('app.order_domain'),
    'middleware' => [
        'domain.order_domain',
    ],
], function () {
    Route::get(config('react.index_path_shop_order') . '/{path?}', function () {
        return view('shop-order');
    })->where('path', '.*');

    Route::get(config('react.index_path_customer_order') . '/{path?}', function () {
        return view('customer-order');
    })->where('path', '.*');
});

// Routes for admin site
Route::group([
    'domain' => config('app.admin_domain'),
    'middleware' => [
        'domain.admin_domain',
    ],
], function () {
    Route::get(config('react.index_path_admin') . '/{path?}', function () {
        return view('admin');
    })->where('path', '.*');
});

Route::post('stripe/webhook', 'Webhook\PaymentWebhookController@handleWebhook');
