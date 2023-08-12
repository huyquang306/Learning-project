<?php

namespace App\Http\Middleware;

use App\Models\MShop;
use Closure;

class CheckShopIsDeactive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (is_string($request->shop)) {
            // request param {shop} is string
            $shop = MShop::where('hash_id', $request->shop)->first();
        } else {
            // request param {shop} is model
            $shop = $request->shop;
        }

        if ($shop) {
            if (!$shop->is_active) {
                return response()->json([
                    'status' => 'failure',
                    'message' => config('const.httpStatusCode.403.message'),
                    'result' => [
                        'fields' => 'deactive',
                        'errorCode' => 'deactive_shop',
                        'errorMessage' => config('const.httpStatusCode.403.message'),
                    ],
                ], 401);
            }
        }

        return $next($request);
    }
}
