<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Schema;

class ShopItemRequest extends FormRequest
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
                if (preg_match('/\/shop\/.+\/item\/?$/', $request->path())) {
                    $validate = [
                        'name' => ['required', 'string', 'max:255'],
                        'price' => ['required', 'integer', 'min:1'],
                    ];
                }
                break;

            default:
                break;
        }
        return $validate;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'required',
            'name.string' => 'not_string',
            'name.max' => 'over_max_length',
            'price.required'  => 'required',
            'price.integer'  => 'not_integer',
            'price.min'  => 'less_min_length',
        ];
    }

    protected function failedValidation(Validator $validator) {
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

    public function withValidator(Validator $validator) {
        $validator->after(
            function ($validator) {
                $columns = Schema::getColumnListing('m_item');
                foreach ((array)$this->all() as $key => $value) {
                    if (!in_array($key, $columns)) {
                        $validator->errors()->add($key, 'not_exist_param');
                    }
                }
            }
        );
    }
}
