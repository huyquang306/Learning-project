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
    'IMAGE_RESIZE_S' => [200, 200],
    'IMAGE_RESIZE_M' => [500, 500],
    'IMAGE_RESIZE_L' => [1000, 1000],
    'QR_CODE_SIZE' => 200,
    'TABLE_QR_DEFAULT_NUMBER_OF_CUSTOMERS' => 1,
    'function_helper' => [
        'menu_price' => [
            'menu_type' => 1,
            'order_type' => 2,
            'course_price_type' => 3,
        ],
    ],
    'validator_rules' => [
        'regex_time' => 'regex:/^((([0-1][0-9]|2[0-3]):([0-5][0-9])))$/',
        'regex_time_seconds' => 'regex:/^((([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])))$/',
    ],
    'ADDRESS_SERVICE_URL' => 'https://zip-cloud.appspot.com',
    'GOOGLE_MAPS_API_ENDPOINT' => 'https://maps.googleapis.com/maps/',
    'PAYMENT' => [
        'START_DAY_PAYMENT_IN_MONTH' => env('MIX_START_DAY_PAYMENT_IN_MONTH', 1),
    ],
    'DEFAULT_CATEGORY' => [
        [
            'name' => 'Đồ uống có cồn',
            'short_name' => 'alcohol',
            'parent_id' => 0,
            'tier_number' => 1,
            'childCategories' => [
                [
                    'name' => 'Bia',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Cocktail',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Rượu',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Sochu',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Rượu vang',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Rượu táo mèo',
                    'tier_number' => 2,
                ],
            ],
        ],
        [
            'name' => 'Đồ uống',
            'short_name' => 'drink',
            'parent_id' => 0,
            'tier_number' => 1,
            'childCategories' => [
                [
                    'name' => 'Trà đá',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Nước ép',
                    'tier_number' => 2,
                ],
            ],
        ],
        [
            'name' => 'Món ăn',
            'short_name' => 'cooking',
            'parent_id' => 0,
            'tier_number' => 1,
            'childCategories' => [
                [
                    'name' => 'Món khai vị',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Salad',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Thịt',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Hải sản',
                    'tier_number' => 2,
                ],
            ],
        ],
        [
            'name' => 'Cơm',
            'short_name' => 'rice',
            'parent_id' => 0,
            'tier_number' => 1,
            'childCategories' => [
                [
                    'name' => 'Cơm',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Mì',
                    'tier_number' => 2,
                ],
            ],
        ],
        [
            'name' => 'Món tráng miệng',
            'short_name' => 'dessert',
            'parent_id' => 0,
            'tier_number' => 1,
            'childCategories' => [
                [
                    'name' => 'Kem',
                    'tier_number' => 2,
                ],
                [
                    'name' => 'Trái cây',
                    'tier_number' => 2,
                ],
            ],
        ],
    ],
    'DEFAULT_MENUS' => [
        [
            'large_cate' => 'Đồ uống có cồn',
            'small_cate' => 'Bia',
            'name' => 'Bia Heineken',
            'estimated_preparation_time' => 1,
            'cook_place' => 'Nhà bếp',
            'price' => 500,
            'tax_rate' => 0.1,
            'status' => 'onsale',
            'image' => 'img/shop/default/menus/no1.jpg',
        ],
        [
            'large_cate' => 'Đồ uống có cồn',
            'small_cate' => 'Rượu vodka',
            'name' => 'ハイボール',
            'estimated_preparation_time' => 1,
            'cook_place' => 'Nhà bếp',
            'price' => 450,
            'tax_rate' => 0.1,
            'status' => 'onsale',
            'image' => 'img/shop/default/menus/no2.jpg',
        ],
        [
            'large_cate' => 'Đồ uống',
            'small_cate' => 'Nước ép',
            'name' => 'Ccca cola',
            'estimated_preparation_time' => 1,
            'cook_place' => 'Nhà bếp',
            'price' => 350,
            'tax_rate' => 0.1,
            'status' => 'onsale',
            'image' => 'img/shop/default/menus/no3.jpg',
        ],
        [
            'large_cate' => 'Món ăn',
            'small_cate' => 'Món khai vị',
            'name' => 'Gỏi hoa chuối',
            'estimated_preparation_time' => 2,
            'cook_place' => 'Nhà bếp',
            'price' => 300,
            'tax_rate' => 0.1,
            'status' => 'onsale',
            'image' => 'img/shop/default/menus/no4.jpg',
        ],
        [
            'large_cate' => 'Món ăn',
            'small_cate' => 'Thịt',
            'name' => 'Gà rán',
            'estimated_preparation_time' => 10,
            'cook_place' => 'Nhà bếp',
            'price' => 600,
            'tax_rate' => 0.1,
            'status' => 'onsale',
            'image' => 'img/shop/default/menus/no5.jpg',
        ],
    ],
    'DEFAULT_COOK_PLACE' => [
        [
            'name' => 'Nhà bếp',
        ],
    ],
    'PRINTER_POSITIONS' => [
        'NO_SELECT' => [
            'label' => 'Không có sẵn',
            'value' => 'no_select',
        ],
        'KITCHEN' => [
            'label' => 'Nhà bếp',
            'value' => 'kitchen',
        ],
        'FRONT' => [
            'label' => 'Quầy thu ngân',
            'value' => 'front',
        ],
    ],
    'printer_status' => [
        'pending_status' => 0,
        'printed_status' => 1,
        'error_status' => 2,
    ],
    'httpStatusCode' => [
        '200' => [
            'message' => 'Yêu cầu thực hiện thành công',
        ],
        '400' => [
            'message' => 'Yêu cầu không được thực hiện',
        ],
        '401' => [
            'message' => 'Lỗi xác thực',
        ],
        '403' => [
            'message' => 'Không có quyền thực hiện',
        ],
        '404' => [
            'message' => 'Không tìm thấy',
        ],
        '409' => [
            'message' => 'Lỗi do xung đột',
        ],
        '422' => [
            'message' => 'Dữ liệu không hợp lệ',
        ],
        '500' => [
            'message' => 'Lỗi máy chủ',
        ]
    ],
    'errorCode' => [
        'invalid_param' => 'Tham số không hợp lệ',
        'invalid_request' => 'Yêu cầu không hợp lệ',
        'pdo_exception' => 'Lỗi cơ sở dũ liệu',
        'exception' => 'Lỗi xử lý',
        'unauthorized' => 'Lỗi xác thực',
        'not_permission_access' => 'Không có quyền',
        'not_found' => 'Không tìm thấy',
        'internal_server_error' => 'Có lỗi xảy ra',
        'validation' => [
            'required' => 'Trường này bắt buộc phải có giá trị',
            'date_format' => 'Sai định dạng thời gian',
            'numeric' => 'Không phải số',
            'string' => 'Không phải kí tự',
            'regex' => 'Văn bản không hợp lệ',
        ],
        'invalid_qr_code' => 'Mã QR không chính xác, vui lòng tải lại',
    ],
    'pagination' => [
        'USERS_PAGINATION' => 10,
        'SHOPS_PAGINATION' => 10,
        'STAFFS_PAGINATION' => 10,
        'admin' => [
            'shops_pagination' => 50,
            'billings_pagination' => 10,
        ],
        'BILLING_PAGINATION' => 10,
        'ORDER_HISTORY_PAGINATION' => 20,
    ],
    'printers_folder_name' => 'printers',
    'COURSE_TYPE' => [
        'MAIN_COURSE' => 0,
        'EXTEND_COURSE' => 1,
    ],
    'ORDER_TYPE' => [
        'ORDER_MENU' => 0,
        'ORDER_COURSE' => 1,
        'ORDER_EXTEND_COURSE' => 2,
        'ORDER_SERVICE_FEE' => 3,
        'ORDER_WITHOUT_MENU' => 4,
    ],
    'ORDER_SERVICE_FEE_NAME' => 'サービス料',
    'COURSE_ORDER_END_TIME' => 5,
    'time_format' => [
        'date_time' => 'YYYY/MM/DD HH:MM',
    ],
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
