<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class ShopRequest extends FormRequest
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
    public function rules(Request $request)
    {
        $validate = [];
        switch ($request->method()) {
            case 'POST':
                $validate = [
                    'name' => 'required',
                    'email' => 'required|email:filter',
                ];
                break;

            case 'GET':
                if (preg_match('/\/user\/area/', $request->path())) {
                    $validate = [
                        'sw_lat'    => ['required', 'numeric'],
                        'sw_lon'    => ['required', 'numeric'],
                        'ne_lat'    => ['required', 'numeric'],
                        'ne_lon'    => ['required', 'numeric'],
                    ];
                }
                break;

            case 'PUT':
                $validate = [
                    'start_time' => [
                        'nullable',
                        config('const.validator_rules.regex_time_seconds')
                    ],
                    'end_time' => [
                        'nullable',
                        config('const.validator_rules.regex_time_seconds')
                    ],
                    'businessHours.*.name' => 'required|string|max:32',
                    'businessHours.*.start_time' => [
                        'required',
                        config('const.validator_rules.regex_time_seconds'),
                    ],
                    'businessHours.*.finish_time' => [
                        'required',
                        config('const.validator_rules.regex_time_seconds'),
                    ],
                    'sns_links' => 'array|max:3',
                    'sns_links.*.name' => 'nullable|string|max:32',
                    'sns_links.*.description' => 'nullable|string|max:50',
                    'sns_links.*.link' => 'nullable|string|max:500',
                    'instagram_link' => 'array',
                    'instagram_link.*.name' => 'nullable|string|max:32',
                    'instagram_link.*.comment' => 'nullable|string|max:50',
                    'instagram_link.*.hash_tag' => 'nullable|string|max:500',
                    'instagram_link.*.link' => 'nullable|string|max:500',
                ];
                break;

            default:
                break;
        }
        return $validate;
    }
}
