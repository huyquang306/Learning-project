<?php

namespace App\Http\Requests\Shop;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class OrderUpdateRequest extends FormRequest
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
    public function rules(Request $request): array
    {
        switch ($request->method()) {
            case 'PUT':
                $validate = [
                    'add_menu' => ['array'],
                    'add_menu.*.menu_hash_id' => ['required', 'exists:m_menu,hash_id'],
                    'add_menu.*.quantity' => ['required', 'numeric'],

                    'add_without_menus' => 'array',
                    'add_without_menus.*.menu_name' => 'required|string|max:30',
                    'add_without_menus.*.price' => 'required|numeric|max:999999999999',
                    'add_without_menus.*.quantity' => 'required|numeric|max:999999999999',
                    'add_without_menus.*.tax_value' => 'required|numeric|max:999999999999',
                    'add_without_menus.*.tax_rate' => 'required|numeric|max:999999999999',

                    'cancel_orders'=> ['array'],
                    'cancel_orders.*'=> ['exists:t_order,id'],

                    'update_orders'=> ['array'],
                    'update_orders.*.id'=> ['exists:t_order,id'],
                    'update_orders.*.quantity'=> ['required', 'numeric'],
                    'update_orders.*.status' => ['numeric'], //, 'between:0,2'
                ];
                break;
            default:
                $validate = [];
                break;
        }

        return $validate;
    }

    public function messages(): array
    {
        return [
            'add_menu.array' => 'not_array',
            'add_menu.*.menu_hash_id.required' => 'required',
            'add_menu.*.hash_id.exists' => 'not_exists',
            'add_menu.*.quantity.required' => 'required',
            'add_menu.*.quantity.exists' => 'not_number',

            'cancel_orders.array' => 'not_array',
            'cancel_orders.*.exists' => 'not_exists',

            'update_orders'=> 'not_array',
            'update_orders.*.id.exists'=> 'not_exists',
            'update_orders.*.quantity.required'=> 'required',
            'update_orders.*.quantity.exists'=> 'not_number',
            'update_orders.*.status.exists'=> 'not_number',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $message = $validator->errors()->messages();
        $key = key($message);

        $res = response()->json(
            [
                'status' => 'failure',
                'message' => $message[$key][0],
                'result' => [
                    'fields'=> $key,
                    'errorCode' => $message[$key][0]
                ]
            ],
            400
        );

        throw new HttpResponseException($res);
    }

    public function withValidator(Validator $validator)
    {
    }
}
