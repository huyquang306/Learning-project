<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;

class MenuRequest extends FormRequest
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
            default:
                $validate = [];
                break;
        }
        return $validate;
    }

    /**
     * @return array
     */
    public function messages(): array
    {
        return [];
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
                    'fields'=> $key,
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
