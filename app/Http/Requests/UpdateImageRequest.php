<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateImageRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'file'=> 'bail|required|file|image|mimes:jpeg,png,jpg,gif,bmp|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'required',
            'file.file' => 'not_file',
            'file.image' => 'not_image',
            'file.mimes' => 'mimes_error',
            'file.max' => 'over_max_size'
        ];
    }

    /**
     * @param Validator $validator
     * @throws HttpResponseException
     */
    public function failedValidation(Validator $validator)
    {
        $message = $validator->errors()->messages();
        $key = key($message);

        $res = response()->json(
            [
                'status' => 'failure',
                'message' => $message[$key][0],
                'result' => [
                    'fields'=> $key,
                    'errorCode' => $message[$key][0],
                    'detail' => $validator->errors()->toArray()
                ]
            ], 400
        );

        throw new HttpResponseException($res);
    }
}
