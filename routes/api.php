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

        Route::group(['prefix' => 'shop', 'middleware' => ['guest:api']],
            function () {
                Route::get('/{shop?}', 'Api\ShopController@show');
                Route::post('/', 'Api\ShopController@createTmpShop');
                Route::post('/verify', 'Api\ShopController@verifyShopRegister');

                // Item
                Route::get('{shop}/item', 'Api\ItemController@index');
                Route::post('{shop}/item', 'Api\ItemController@create');
                Route::post('{shop}/item/{item}/images', 'Api\ItemController@updateImages');
                Route::put('{shop}/item/{item}', 'Api\ItemController@update');
                Route::delete('{shop}/item/{item}', 'Api\ItemController@destroy');
            }
        );
    }
);
