<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseAPIRequest;

class VerifyShopRequest extends BaseAPIRequest
{
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
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        return [
            'token' => 'required|string|max:128',
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
            'token' => 'required|string|max:128',
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
