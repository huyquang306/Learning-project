<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Validator;

class CategoryRequest extends FormRequest
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
            case 'GET':
                $validate = [
                    'tier_number' => ['required', 'numeric'],
                    'parent_id' => ['required', 'numeric']
                ];
                break;
            default:
                $validate = [];
                break;
        }

        return $validate;
    }

    /**
     * Get error message when validate fail.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'tier_number.required' => 'required',
            'tier_number.numeric' => 'numeric',
            'parent_id.exists' => 'exists',
            'parent_id.numeric' => 'numeric'
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
}
