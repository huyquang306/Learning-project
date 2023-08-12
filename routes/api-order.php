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
                'middleware' => [
                    'guest:api',
                    'checkShopIsDeactive',
                ]
            ],
            function () {
                // Shop
                Route::get('/{shop?}', 'Api\ShopController@show');

                // Tables
                Route::get('{shop}/table', 'Api\Shop\TableController@index');
                Route::post('{shop}/table', 'Api\Shop\TableController@create');
                Route::put('{shop}/table/{table}', 'Api\Shop\TableController@update');
                Route::delete('{shop}/table/{table}', 'Api\Shop\TableController@delete');

                // Ordergroups
                Route::get('/{shop}/ordergroupsummary', 'Api\Shop\OrderGroupController@getSummary');
                Route::get('/{shop}/history/ordergroupsummary', 'Api\Shop\OrderGroupController@getOrdergroups');
                Route::post('/{shop}/ordergroup', 'Api\Shop\OrderGroupController@create')
                    ->middleware('checkUsageQRCodeOver');
                Route::delete('/{shop}/ordergroup/{ordergroup}', 'Api\Shop\OrderGroupController@delete');
                Route::put('/{shop}/ordergroup/{ordergroup}', 'Api\Shop\OrderGroupController@update');
                Route::post('/{shop}/ordergroup/{ordergroup}/extend-time', 'Api\Shop\OrderGroupController@extendTime');
                Route::post('/{shop}/ordergroup/{ordergroup}/auto-calculate-extend', 'Api\Shop\OrderGroupController@autoExtendCourse');

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

                // Customer
                Route::apiResource('{shop}/users', 'Api\Shop\UserController');
                Route::get('{shop}/history/users', 'Api\Shop\UserHistoryController@index');
                Route::get('{shop}/history/users/{user}', 'Api\Shop\UserHistoryController@show');

                // Menu
                Route::get('{shop}/master-menus', 'Api\Shop\MenuController@getMasterMenus');
                Route::apiResource('{shop}/menu', 'Api\Shop\MenuController')
                    ->except(['create', 'edit']);
                Route::post('{shop}/menu-update/{menu}', 'Api\Shop\MenuController@updateMenuResource');
                Route::post('{shop}/many-menus', 'Api\Shop\MenuController@createOrUpdateManyMenus');

                // Cook place
                Route::apiResource('{shop}/cook-places', 'Api\Shop\ShopCookPlaceController')
                    ->except(['show', 'create', 'edit']);

                // Announcement
                Route::group([
                    'prefix' => '{shop}/announcements'
                ], function () {
                    Route::get('/', 'Api\Shop\AnnouncementController@index');
                    Route::post('/', 'Api\Shop\AnnouncementController@update');
                });

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

                // Billing for service plan
                Route::get('/{shop}/billing/history', 'Api\Shop\BillingServicePlanController@show');
            }
        );

        Route::group(
            [
                'prefix' => 'user',
                'middleware' => [
                    'guest:api',
                    'checkShopIsDeactive',
                ]
            ],
            function () {
                // customer update information
                Route::get('/search-user', 'Api\User\UserController@listUserByPhoneNumber');
                Route::get('/{user?}', 'Api\User\UserController@show');
                Route::put('{user}', 'Api\User\UserController@update');
                Route::post('/', 'Api\User\UserController@create');

                // Order group
                Route::get('/{shop}/ordergroup/{ordergroup}', 'Api\User\OrderGroupController@show');
                Route::get('{shop}/billing/calc/{ordergroup}', 'Api\User\BillingController@calculate');

                // Category
                Route::get('{shop}/category', 'Api\User\CategoryController@index');
                Route::get('{shop}/category/{category}', 'Api\User\CategoryController@show');

                // Menu
                Route::get('{shop}/menu', 'Api\User\MenuController@index');
                Route::get('{shop}/menu/{menu}', 'Api\User\MenuController@show');
                Route::get('{shop}/menu-recommend', 'Api\User\MenuController@getMenuCategoryRecommend');

                // Course order
                Route::get('{shop}/course', 'Api\User\CourseController@index');
                Route::get('{shop}/course/{course}', 'Api\User\CourseController@show');
                Route::put('{shop}/course-order/{ordergroup}', 'Api\User\CourseController@update');

                // Routes need to authenticate
                Route::group(['middleware' => 'customer-order.auth'], function () {
                    // Order
                    Route::post('/{shop}/order/{odergroup}', 'Api\User\OrderController@create');
                    Route::put('/{shop}/order/{ordergroup}', 'Api\User\OrderController@update');
                    Route::delete('/{shop}/order/{menu}/{ordergroup}', 'Api\User\OrderController@delete');
                    // Billing
                    Route::post('{shop}/billing/payrequest/{ordergroup}', 'Api\User\BillingController@payRequest');
                });

                // Tax options
                Route::get('{shop}/tax-info', 'Api\User\ShopController@getTaxInfo');
            }
        );
    }
);