<?php

namespace App\Http\Requests\Shop;

use Illuminate\Foundation\Http\FormRequest;

class CourseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:100',
            'time_block_unit' => 'required|integer|min:1',
            'file' => 'nullable|bail|file|mimes:jpeg,png,jpg,gif,bmp|max:10240',
            'status' => 'nullable|string|max:10',
            'alert_notification_time' => 'nullable|integer',
            'list_course_prices' => 'required|array',
            'list_course_prices.*.block_time_start' => ['required', config('const.validator_rules.regex_time')],
            'list_course_prices.*.block_time_finish' => ['required', config('const.validator_rules.regex_time')],
            'list_course_prices.*.unit_price' => 'required|integer|min:1',
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
}
