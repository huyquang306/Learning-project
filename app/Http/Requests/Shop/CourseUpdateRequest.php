<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;
use Illuminate\Foundation\Http\FormRequest;

class CourseUpdateRequest extends BaseApiRequest
{
    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        return [
            'name' => 'string|max:50',
            'time_block_unit' => 'integer|min:1',
            'file' => 'nullable|bail|file|mimes:jpeg,png,jpg,gif,bmp|max:10240',
            'status' => 'nullable|string|max:10',
            'alert_notification_time' => 'nullable|integer',
            'list_course_prices' => 'array',
            'list_course_prices.*.hash_id' => 'nullable|string|max:16',
            'list_course_prices.*.block_time_start' => [config('const.validator_rules.regex_time')],
            'list_course_prices.*.block_time_finish' => [config('const.validator_rules.regex_time')],
            'list_course_prices.*.unit_price' => 'integer|min:1000',
            'list_course_prices.*.status' => 'nullable|string|max:10',
            'list_course_prices.*.tax_value' => 'nullable|integer|max:999999999999',
            'list_course_prices.*.m_tax_id' => 'nullable|integer|exists:m_tax,id',
            'list_menus' => 'array',
            'list_menus.*.menu_hash_id' => ['exists:m_menu,hash_id'],
            'list_menus.*.status' => 'nullable|string|max:10',
            'initial_propose_flg' => 'required|integer',
            'shop_alert_flg' => 'required|integer',
            'user_alert_flg' => 'required|integer',
            'shop_end_time_alert_flg' => 'required|integer',
            'user_end_time_alert_flg' => 'required|integer',
        ];
    }

    /**
     * Custom message for rules
     *
     * @return array
     */
    public function getMessages(): array
    {
        return [];
    }
}
