<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Validator;

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
     * @param Request $request
     * @return array
     */
    public function rules(Request $request): array
    {
        $validate = [];
        switch ($request->method())
        {
            case 'POST':
                $validate = [
                    'orders.*.menu_hash_id' => ['required', 'exists:m_menu,hash_id'],
                    'orders.*.quantity' => ['required', 'numeric'],
                ];
                break;

            case 'PUT':
                $validate = [
                    'orders.*.menu_hash_id' => ['required', 'exists:m_menu,hash_id'],
                    'orders.*.quantity' => ['required', 'numeric'],
                    'orders.*.status' => ['required', 'numeric'],
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
            'orders.*.menu_hash_id.required' => 'required',
            'orders.*.menu_hash_id.exists' => 'not_exists',
            'orders.*.quantity.required' => 'required',
            'orders.*.quantity.numeric' => 'not_numeric',
            'orders.*.status.required' => 'required',
            'orders.*.status.numeric' => 'not_numeric',
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
