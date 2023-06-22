<?php

namespace App\Http\Middleware;

use App\Repositories\OrderGroupRepository;
use Closure;
use Illuminate\Http\Request;

class CustomerOrderAuth
{
    private $orderGroupRepository;

    public function __construct(OrderGroupRepository $orderGroupRepository)
    {
        $this->orderGroupRepository = $orderGroupRepository;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $order_group_id = $request->header('OrderGroupId');

        if (!$order_group_id || !$this->orderGroupRepository->checkOrderGroupAvailable($order_group_id)) {
            return response()->json([
                'success' => false,
                'code' => 'ordergroup_not_available',
                'message' => 'ordergroup not available'
            ], 401);
        }

        return $next($request);
    }
}
