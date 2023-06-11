<?php

namespace App\Http\Requests\Shop;

use App\Rules\Shop\Menu\MenuInitialOrderFlgOnNotInCourseRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Class MenuRequest
 * @package App\Http\Requests\Shop
 */
class MenuRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request): array
    {
        $validate = [];
        switch ($request->method()) {
            case 'POST':
                $validate = [
                    'name' => ['required', 'string', 'max:30'],
                    'price' => ['required', 'integer', 'min:0'],
                    'm_menu_category_ids' => ['required', 'array', 'size:2'],
                    'm_menu_category_ids.*' => ['exists:m_menu_category,id'],
                    'file' => 'bail|file|mimes:jpeg,png,jpg,gif,bmp|max:10240',
                    'status' => ['required'],
                    'tax_value' => 'numeric|min:0|lte:price',
                    'm_shop_business_hour_prices' => 'array',
                    'm_shop_business_hour_prices.*.id' => 'nullable|exists:m_shop_business_hour_price,id',
                    'm_shop_business_hour_prices.*.price' => 'required|numeric|min:0|max:999999999999',
                    'm_shop_business_hour_prices.*.tax_value' => 'required|numeric|min:0|max:999999999999',
                    'm_shop_business_hour_prices.*.m_shop_business_hour_id' => 'required|exists:m_shop_business_hour,id',
                    'm_shop_business_hour_prices.*.display_flg' => 'required|numeric|min:0|max:1',
                    //'m_tax_id' => 'exists:m_tax,id',
                    'initial_order_flg' => [
                        'numeric',
                        'min:0',
                        'max:1',
                        new MenuInitialOrderFlgOnNotInCourseRule($this->menu),
                    ],
                ];
                break;

            case 'PUT':
                $validate = [
                    'name' => ['string', 'max:30'],
                    'price' => ['integer', 'min:1'],
                    'm_menu_category_ids' => ['array', 'size:2'],
                    'm_menu_category_ids.*' => ['exists:m_menu_category,id'],
                    'file' => 'bail|file|mimes:jpeg,png,jpg,gif,bmp|max:10240',
                    'is_recommend' => ['boolean'],
                    'is_promotion' => ['boolean'],
                ];
                break;

            default:
                $validate = [];
                break;
        }
        return $validate;
    }

    /**
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'required',
            'name.string' => 'not_string',
            'name.max' => 'over_max_length',

            'price.required'  => 'required',
            'price.integer'  => 'not_integer',
            'price.min'  => 'less_min_length',

            'm_menu_category_ids.required' => 'required',
            'm_menu_category_ids.array' => 'not_array',
            'm_menu_category_ids.size' => 'not_size',
            'm_menu_category_ids.*.exists' => 'not_existed',

            'status.required' => 'required',

            'file' => 'required',
            'file.file' => 'not_file',
            'file.image' => 'not_image',
            'file.mimes' => 'mimes_error',
            'file.max' => 'over_max_size',

            'is_recommend.boolean' => 'not_boolean',
            'is_promotion.boolean' => 'not_boolean'
        ];
    }

    /**
     * @param Validator $validator
     */
    protected function failedValidation(Validator $validator)
    {

        $message = $validator->errors()->messages();
        $key = key($message);

        $res = response()->json(
            [
                'status' => 'failure',
                'message' => $message[$key][0],
                'result' => [
                    'fields' => $key,
                    'errorCode' => $message[$key][0]
                ]
            ],
            400
        );
        throw new HttpResponseException($res);
    }

    /**
     * @param Validator $validator
     */
    public function withValidator(Validator $validator)
    {
    }
}
