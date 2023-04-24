<?php

namespace App\Http\Requests;

use App\Rules\Shop\CopyShopByHashIdRule;

class TmpShopRequest extends BaseApiRequest
{
    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        // Case 1: copy shop
        $isActive = $this->is_active_shop;
        if ($isActive) {
            return [
                'hash_id' => [
                    'required',
                    'string',
                    'exists:m_shop,hash_id',
                    new CopyShopByHashIdRule(),
                ],
                'email' => 'required|email:filter|unique:m_shop,email',
            ];
        }

        // Case 2: register new shop
        return [
            'name' => 'required|string|max:30',
            'email' => 'required|email:filter|unique:m_shop,email',
            'phone_number' => 'required|string|max:15',
            'address' => 'required|string|max:200',
            'postal_code' => 'required|string|max:10',
            'prefecture' => 'required|string|max:5',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'city' => 'required|string|max:50',
            'genre' => 'array',
            'genre.*' => 'string',
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

    public function messages(): array
    {
        return [
            'email.unique' => 'email must be unique',
            'name.required' => 'required',
            'sw_lat.required' => 'required',
            'sw_lat.numeric' => 'not_numeric',
            'sw_lon.required' => 'required',
            'sw_lon.numeric' => 'not_numeric',
            'ne_lat.required' => 'required',
            'ne_lat.numeric' => 'not_numeric',
            'ne_lon.required' => 'required',
            'ne_lon.numeric' => 'not_numeric',
        ];
    }
}
