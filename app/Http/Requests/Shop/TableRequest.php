<?php

namespace App\Http\Requests\Shop;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Schema;
use App\Models\MTable;


class TableRequest extends FormRequest
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

        switch ($request->method()) {
            case 'PUT':
            case 'POST':
                $validate = [
                    'code' => ['required', 'max:20'],
                ];
            break;
            default:
            break;
        }
        return $validate;
    }

    public function messages()
    {
        return [
            'code.required' => 'required',
            'code.max' => 'over_max_length',
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
                $columns = Schema::getColumnListing('m_table');
                foreach ((array)$this->all() as $key => $value) {
                    if (!in_array($key, $columns)) {
                        $validator->errors()->add($key, 'not_exist_param');
                    }

                    if($key === 'code' && MTable::where('m_shop_id', $this->shop->id)->where('code', $value)->count()) {
                        $validator->errors()->add($key, 'Tên bàn đã được sử dụng');
                    }
                }
            }
        );
    }
}
