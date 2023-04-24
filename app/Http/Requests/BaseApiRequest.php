<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class BaseApiRequest extends FormRequest
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
     * Get data to be validated from the request.
     *
     * @return array
     */
    public function validationData(): array
    {
        return array_merge($this->all(), $this->query());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     * @throws \Exception
     */
    public function rules(): array
    {
        switch ($this->getMethod()) {
            case 'GET':
                return $this->rulesGet();
            case 'POST':
                return $this->rulesPost();
            case 'PUT':
                return $this->rulesPut();
            default:
                throw new \Exception('Not define');
        }
    }

    /**
     * Custom errors response
     * Error 422 : When the validator return fail
     * Error 409 : The HTTP request was valid, but the current state of the server prevents it from being executed.
     *
     * @param Validator $validator : validator
     *
     * @return void
     */
    public function failedValidation(Validator $validator)
    {
        $errorsList = $validator->errors()->getMessages();

        $errorReturn = [];
        $responseCode = 422;
        foreach ($errorsList as $key => $errorList) {
            foreach ($errorList as $error) {
                if ($error == 'conflict') {
                    $responseCode = 409;
                }

                $errorContent = [
                    'field' => $key,
                    'errorCode' => $error,
                    'errorMessage' => config('const.errorCode.' . $error),
                ];
                array_push($errorReturn, $errorContent);
            }
        }

        \Log::error($validator->errors());
        throw new HttpResponseException(response()->json([
            'status' => 'failure',
            'message' => config('const.httpStatusCode.' . $responseCode . '.message'),
            'result' => $errorReturn,
        ], $responseCode));
    }

    /**
     * rulesGet
     * handle rule method get
     *
     * @return array
     */
    public function rulesGet(): array
    {
        return [];
    }

    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        return [];
    }

    /**
     * rulesPut
     * handle rule method put
     *
     * @return array
     */
    public function rulesPut(): array
    {
        return [];
    }

    /**
     * Custom message for rule
     *
     * @return array
     */
    abstract public function getMessages(): array;
}
