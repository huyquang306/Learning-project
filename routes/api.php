<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(
    function () {
        Route::group(
            ['prefix' => 'auth'],
            function () {
                Route::post('forgot-password', 'Api\ShopController@generateForgotPasswordLink');
                Route::get('forgot-password/verify', 'Api\ShopController@verifyShopForgotPassword');
                Route::post('reset-password', 'Api\ShopController@resetPassword');
                Route::post('register/verify', 'Api\ShopController@sendEmailVerifyShopRegister');
            }
        );

        Route::group(
            ['prefix' => 'system', 'middleware' => ['guest:api']],
            function () {
                // configurations
                Route::get('configurations', 'Api\ConfigurationController@index');
            }
        );

        Route::group(
            ['prefix' => 'address', 'middleware' => ['guest:api']],
            function () {
                Route::get('/zip/{zip_code}', 'Api\AddressController@zipToAddress');
                Route::get('/geo/{address}', 'Api\AddressController@getGeoCode');
            }
        );

        Route::group([
            'prefix' => 'shop',
            'middleware' => [
                'guest:api',
                'checkShopIsDeactive',
            ]
        ],
            function () {
                // Service Plan
                Route::get('service-plans', 'Api\Shop\ServicePlanController@index');

                // Shop
                Route::get('/{shop?}', 'Api\ShopController@show');
                Route::post('/', 'Api\ShopController@createTmpShop');
                Route::post('/verify', 'Api\ShopController@verifyShopRegister');
                Route::put('/{shop}', 'Api\ShopController@update');

                // Item
                Route::get('{shop}/item', 'Api\ItemController@index');
                Route::post('{shop}/item', 'Api\ItemController@create');
                Route::post('{shop}/item/{item}/images', 'Api\ItemController@updateImages');
                Route::put('{shop}/item/{item}', 'Api\ItemController@update');
                Route::delete('{shop}/item/{item}', 'Api\ItemController@destroy');

                // Tax
                Route::get('{shop}/tax', 'Api\Shop\ShopPosController@show');
                Route::post('{shop}/tax', 'Api\Shop\ShopPosController@update');
                Route::get('{shop}/tax-options', 'Api\Shop\ShopPosController@getTaxOptions');

                // Genre
                Route::post('/{shop}/genre', 'Api\GenreController@store');
                Route::get('/{shop}/genre', 'Api\GenreController@show');
                Route::put('/{shop}/genre', 'Api\GenreController@update');

                // Payment & Service setting
                Route::group(
                    ['prefix' => '{shop}/setting'],
                    function () {
                        // Update service plans
                        Route::post('service-plan', 'Api\Shop\ServicePlanController@update');

                        Route::group(
                            ['prefix' => 'payments'],
                            function () {
                                Route::get('customer-payment', 'Api\Shop\PaymentController@getCustomerPayment');
                                Route::post('customer-payment', 'Api\Shop\PaymentController@registerOrUpdateCustomerPayment');

                                Route::post('setup-payment-method', 'Api\Shop\PaymentController@setupPaymentMethod');
                                Route::post('register-payment-method', 'Api\Shop\PaymentController@registerPaymentMethod');
                                Route::post('active-card', 'Api\Shop\PaymentController@activeCard');
                            }
                        );
                    }
                );

                Route::get('{shop}/payment-methods-for-cus', 'Api\Shop\PaymentMethodForCusController@index');
            }
        );

        Route::group(
            ['prefix' => 'genre', 'middleware' => ['guest:api']],
            function () {
                Route::get('/{id?}', 'Api\GenreController@index');
            }
        );
    }
);
