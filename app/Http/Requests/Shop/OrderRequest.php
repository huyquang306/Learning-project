<?php

namespace App\Http\Requests\Shop;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class OrderRequest extends FormRequest
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
        switch ($request->method())
        {
            case 'POST':
                $validate = [
                    'orders.*.menu_hash_id' => ['required', 'exists:m_menu,hash_id'],
                    'orders.*.quantity' => ['required', 'numeric'],

                    'add_without_menus' => 'array',
                    'add_without_menus.*.menu_name' => 'required|string|max:30',
                    'add_without_menus.*.price' => 'required|numeric|max:999999999999',
                    'add_without_menus.*.quantity' => 'required|numeric|max:999999999999',
                    'add_without_menus.*.tax_value' => 'required|numeric|max:999999999999',
                    'add_without_menus.*.tax_rate' => 'required|numeric|max:999999999999',
                ];
                break;
            case 'PUT':
                $validate = [
                    'orders.*.order_id' => ['required', 'exists:t_order,id'],
                    'orders.*.order_quantity' => ['required', 'numeric'],
                    'orders.*.status' => ['required', 'numeric'],
                ];
                break;
            default:
                $validate = [];
                break;
        }
        return $validate;
    }

    public function messages()
    {
        return [
            'orders.*.order_id.required' => 'required',
            'orders.*.order_id.exists' => 'not_exists',
            'orders.*.order_quantity.required' => 'required',
            'orders.*.order_quantity.numeric' => 'not_numeric',
            'orders.*.status.required' => 'required',
            'orders.*.status.numeric' => 'not_numeric',
            'orders.*.menu_hash_id.required' => 'required',
            'orders.*.menu_hash_id.exists' => 'not_exists',
            'orders.*.quantity.required' => 'required',
            'orders.*.quantity.numeric' => 'not_numeric',
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
            ], 400
        );
        throw new HttpResponseException($res);
    }

    public function withValidator(Validator $validator)
    {
    }
}
