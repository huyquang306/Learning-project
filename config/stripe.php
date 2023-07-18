<?php

return [
    'currency' => 'jpy',
    'paymentMethods' => [
        'card' => 'card',
    ],
    'status' => [
        'succeeded' => 'succeeded',
    ],
    'invoice' => [
        'collection_method' => 'send_invoice',
        'days_until_due' => 30,
    ],
    'secret_key' => env('MIX_STRIPE_SECRET_KEY'),
];