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

                // Order
                Route::post('/{shop}/ordergroup/{ordergroup}/order', 'Api\Shop\OrderController@create');
                Route::put('/{shop}/ordergroup/{ordergroup}/menu', 'Api\Shop\OrderController@menuUpdate');

                // Course menu master
                Route::get('{shop}/master-courses', 'Api\Shop\CourseController@getMasterCourses');
                Route::get('{shop}/course', 'Api\Shop\CourseController@index');
                Route::get('{shop}/course/{course}', 'Api\Shop\CourseController@show');
                Route::post('{shop}/course', 'Api\Shop\CourseController@create');
                Route::post('{shop}/course-update/{course}', 'Api\Shop\CourseController@update');
                // Delete course
                Route::delete('{shop}/course/{course}', 'Api\Shop\CourseController@delete');
                // Add menu to course
                Route::post('{shop}/course/{course}/menu', 'Api\Shop\CourseController@addMenuCourse');
                // Update menu course
                Route::post('{shop}/course/{course}/menu-update', 'Api\Shop\CourseController@updateMenuCourse');
                // Delete menu course
                Route::delete('{shop}/course/{course}/menu/{menu}', 'Api\Shop\CourseController@deleteMenuCourse');

                // Category
                Route::apiResource('{shop}/category', 'Api\Shop\CategoryController');

                // Menu
                Route::get('{shop}/master-menus', 'Api\Shop\MenuController@getMasterMenus');
                Route::apiResource('{shop}/menu', 'Api\Shop\MenuController')
                    ->except(['create', 'edit']);
                Route::post('{shop}/menu-update/{menu}', 'Api\Shop\MenuController@updateMenuResource');

                // Cook place
                Route::apiResource('{shop}/cook-places', 'Api\Shop\ShopCookPlaceController')
                    ->except(['show', 'create', 'edit']);

                // Upload image
                Route::post('{shop}/upload-image', 'Api\Shop\ImageController@store');

                // Staff
                Route::apiResource('{shop}/staffs', 'Api\Shop\StaffController')
                    ->except(['show', 'create', 'edit']);

                // Billing
                Route::post('/{shop}/billing/payrequest/ordergroup/{ordergroup}', 'Api\Shop\BillingController@create');
                Route::get('{shop}/billing/calc/{ordergroup}', 'Api\Shop\BillingController@calculate');
                Route::put('/{shop}/billing/paying/ordergroup/{ordergroup}', 'Api\Shop\BillingController@paying');
                Route::put('/{shop}/billing/close/ordergroup/{ordergroup}', 'Api\Shop\BillingController@close');
                Route::put('/{shop}/billing/payment/ordergroup/{ordergroup}', 'Api\Shop\BillingController@payment');
            }
        );
    }
);