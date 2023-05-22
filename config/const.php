<?php

return [
    'LENGTH_OF_HASH_ID' => 16,
    'GOOGLE_MAPS_API_ENDPOINT' => 'https://maps.googleapis.com/maps/',
    'shop' => [
        'expired_time' => [
            'register_shop' => 60,     # 1 hour, minute unit
            'forgot_password' => 60,   # 1 hour, minute unit
        ],
    ],
    'exceptions' => [
        'firebase' => [
            'too_many_attempts' => 'TOO_MANY_ATTEMPTS_TRY_LATER',
            'reset_password_exceed_limit' => 'RESET_PASSWORD_EXCEED_LIMIT',
        ],
    ],
    'STATUS_ORDER' => '0',
    'STATUS_FINISH' => '1',
    'STATUS_CANCEL' => '2',
    'ORDER_STATUS' => [
        'SHIPPING' => '3',
        'SHIPPED' => '4',
    ],
    'STATUS_ORDERGROUP' => [
        'PRE_ORDER' => 0,
        'ORDERING' => 1,
        'REQUEST_CHECKOUT' => 2,
        'WAITING_CHECKOUT' => 3,
        'CHECKED_OUT' => 4,
        'CANCEL' => 9
    ],
];
