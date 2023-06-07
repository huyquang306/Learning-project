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
            [
                'prefix' => 'shop',
                'middleware' => 'guest:api'
            ],
            function () {
                // Shop
                Route::get('/{shop?}', 'Api\ShopController@show');

                // Tables
                Route::get('{shop}/table', 'Api\Shop\TableController@index');

                // Ordergroups
                Route::get('/{shop}/ordergroupsummary', 'Api\Shop\OrderGroupController@getSummary');
                Route::get('/{shop}/history/ordergroupsummary', 'Api\Shop\OrderGroupController@getOrdergroups');
                Route::post('/{shop}/ordergroup', 'Api\Shop\OrderGroupController@create');
//                    ->middleware('checkUsageQRCodeOver');

                //Course menu master
                Route::get('{shop}/master-courses', 'Api\Shop\CourseController@getMasterCourses');
            }
        );
    }
);