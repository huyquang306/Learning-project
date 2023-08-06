<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class OrderDomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->getHost() !== config('app.order_domain')
            && $request->getHost() !== config('app.web_server_ip')
            && config('app.env') !== 'testing')
        {
            return \abort(403);
        }

        return $next($request);
    }
}
