<?php

namespace App\Http\Middleware\Shop;

use App\Models\MConditionType;
use App\Models\MFunction;
use App\Repositories\Interfaces\ServicePlanRepositoryInterface;
use App\Repositories\ShopRepository;
use Closure;
use Illuminate\Http\Request;

class CheckUsageCodeOverPlan
{
    protected $shopRepository;
    protected $servicePlanRepository;

    public function __construct(ShopRepository $shopRepository, ServicePlanRepositoryInterface $servicePlanRepository)
    {
        $this->shopRepository = $shopRepository;
        $this->servicePlanRepository = $servicePlanRepository;
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
        $firstDayInMonth = now()->startOfMonth();
        $lastDayInMonth = now()->lastOfMonth();
        $startDayInMonth = config('const.PAYMENT.START_DAY_PAYMENT_IN_MONTH');
        if ($startDayInMonth) {
            $firstDayInMonth->setDay($startDayInMonth);
            $lastDayInMonth = $firstDayInMonth->copy()->addMonth()->subDay();
        }

        $shop = $request->shop->load([
            'tOrderGroups' => function ($orderGroupQuery) use ($firstDayInMonth, $lastDayInMonth) {
                $orderGroupQuery->whereDate('created_at', '>=', $firstDayInMonth)
                    ->whereDate('created_at', '<=', $lastDayInMonth)
                    ->withTrashed();
            },
        ]);
        $servicePlan = $this->shopRepository->getCurrentApplyServicePlan($request->shop);
        if ($servicePlan) {
            // QR using in month
            $usageQRInMonth = count($shop->tOrderGroups);

            // Check limit qr in service plan
            $qrCondition = $servicePlan->rFunctionConditions->first(function ($condition) {
                return $condition->mConditionType
                    && $condition->mConditionType->name === MConditionType::TYPE_MAX_VALUE
                    && $condition->mFunction
                    && $condition->mFunction->code === MFunction::FUNCTION_CODE_QR;
            });
            $expectLimitQR = $qrCondition && $qrCondition->restricted_value ? $qrCondition->restricted_value : 0;
            $additionalPrice = 0;
            if ($qrCondition
                && $qrCondition->mFunction
                && $qrCondition->mFunction->mServicePlanOptions
                && count($qrCondition->mFunction->mServicePlanOptions)
            ) {
                $additionalPrice = $qrCondition->mFunction->mServicePlanOptions[0]->additional_price;
            }

            if ($expectLimitQR && $usageQRInMonth >= $expectLimitQR && $additionalPrice <= 0) {
                $allPlans = $this->servicePlanRepository->getAllServicePlans();
                $lastPlan = count($allPlans) ? $allPlans[count($allPlans) - 1] : null;
                if ($lastPlan && $lastPlan->id === $servicePlan->id) {
                    return response()->json([
                        'status' => 'failure',
                        'message' => 'using_over_highest_plan',
                        'result' => 'Bạn không thể đăng ký thăm khám vì số lượng QR vượt quá giới hạn.',
                    ], 403);
                }

                // TODO: translate
                return response()->json([
                    'status' => 'failure',
                    'message' => 'using_over_plan',
                    'result' => 'Cửa hàng đang dùng vượt giới hạn gói, vui lòng đăng ký gói dịch vụ cao hơn để tiếp tục.',
                ], 403);
            }
        }

        return $next($request);
    }
}
