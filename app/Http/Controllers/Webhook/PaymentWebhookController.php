<?php

namespace App\Http\Controllers\Webhook;

use App\Models\TServiceBilling;
use App\Services\Webhook\PaymentService;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use Symfony\Component\HttpFoundation\Response;

class PaymentWebhookController extends CashierController
{
    protected $paymentService;

    /**
     * PaymentWebhookController constructor.
     *
     * @param PaymentService $paymentService
     */
    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Handle invoice payment succeeded.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleInvoicePaymentSucceeded($payload): Response
    {
        $billingObject = $payload['data']['object'];
        Log::info('[Webhook][handleInvoicePaymentSucceeded] id: ' . $billingObject['id'] . ' running');

        // Find service_billing payment to update status
        $serviceBilling = $this->paymentService->getServiceBillingById($billingObject['id']);
        if ($serviceBilling) {
            $data = [
                'status' => TServiceBilling::SUCCESS_STATUS,
                'invoice_url' => $billingObject['hosted_invoice_url'],
                'invoice_pdf' => $billingObject['invoice_pdf'],
                'log' => ''
            ];
            $this->paymentService->updateServiceBilling($serviceBilling, $data);
            Log::info('[Webhook][handleInvoicePaymentSucceeded] id: ' . $billingObject['id'] . ' done');

            return new Response('Webhook Handled', 200);
        }
        Log::info('[Webhook][handleInvoicePaymentSucceeded] id: ' . $billingObject['id'] . ' failed');

        return new Response('Webhook Handled', 200);
    }

    /**
     * Handle invoice payment failed.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleInvoicePaymentFailed($payload): Response
    {
        $time = now()->format(config('const.time_format.date_time'));
        $billingObject = $payload['data']['object'];
        $typeLog = "[$time]" . $billingObject['type'] . ',';
        Log::info('[Webhook][handleInvoicePaymentFailed] id: ' . $billingObject['id'] . ', type: ' . $typeLog);

        // Find service_billing payment to update status
        $serviceBilling = $this->paymentService->getServiceBillingById($billingObject['id']);
        if ($serviceBilling) {
            $data = [
                'status' => TServiceBilling::FAILED_STATUS,
                'invoice_url' => $billingObject['hosted_invoice_url'],
                'invoice_pdf' => $billingObject['invoice_pdf'],
            ];
            $this->paymentService->updateServiceBilling($serviceBilling, $data);
        }

        return new Response('Webhook Handled', 200);
    }
}
