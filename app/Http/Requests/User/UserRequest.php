<?php

namespace App\Http\Requests\User;

use App\Http\Requests\BaseAPIRequest;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends BaseAPIRequest
{
    /**
     * rulesPut
     * handle rule method put
     *
     * @return array
     */
    public function rulesPut(): array
    {
        return [
            'nick_name' => 'required|string|max:50',
            'email' => 'nullable|email|max:128',
            'family_name' => 'nullable|string|max:30',
            'given_name' => 'nullable|string|max:30',
            'family_name_kana' => 'nullable|string|max:50',
            'given_name_kana' => 'nullable|string|max:50',
            'birth_date' => 'nullable|date|before:today',
            'prefecture' => 'nullable|string|max:5',
            'city' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:200',
            'building' => 'nullable|string|max:100',
        ];
    }

    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        return [
            'nick_name' => 'required|string|max:50',
            'phone_number' => 'required|string|max:12',
        ];
    }

    /**
     * rulesGet
     * handle rule method get
     *
     * @return array
     */
    public function rulesGet(): array
    {
        return [
            'phone_number' => 'required|string|max:12',
        ];
    }

    /**
     * Custom message for rules
     *
     * @return array
     */
    public function getMessages(): array
    {
        return [];
    }
}
