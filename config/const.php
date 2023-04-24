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
];
