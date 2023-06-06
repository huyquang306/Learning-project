<?php

namespace App\Http\Requests\Shop;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Validator;

class OrderGroupRequest extends FormRequest
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
        $validate = [];
        switch ($request->method()) {
            case 'PUT':
                $validate = [
                    'number_of_customers_of_course' => 'nullable|numeric|min:1|max:99',
                    'is_update_initial_menu_orders' => 'nullable|boolean',
                ];
                break;
            case 'POST':
                $validate = [
                    'add_hash_id' => 'required|array',
                    'add_hash_id.*' => 'exists:m_table,hash_id',
                    'number_of_customers' => 'required|numeric|min:1|max:99',
                ];
                break;

            default:
                break;
        }

        return $validate;
    }

    public function messages(): array
    {
        return [
            'add_hash_id.required' => 'required',
            'add_hash_id.exists' => 'not_exists',
            'add_hash_id.array' => 'not_array',

            'number_of_customers.required' => 'Cần nhập số lượng người',
            'number_of_customers.numeric' => 'Cần nhập số lượng người',
            'number_of_customers.min' => 'Số lượng người có thể được nhập từ 1 đến 99',
            'number_of_customers.max' => 'Số lượng người có thể được nhập từ 1 đến 99.',
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
