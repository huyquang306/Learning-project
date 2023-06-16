<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ShopGenreRequest extends FormRequest
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
            'genre.*' => ['required', 'string']
        ];
    }

    protected function failedValidation(Validator $validator) {
        $res = response()->json(
            [
                'status' => 'failure',
                'message' => 'invalid_request',
                'result' => [
                    'fields'=> key($validator->errors()->messages()),
                    'errorCode' => 'invalid_request'
                ]
            ], 400
        );
        throw new HttpResponseException($res);
    }
}
