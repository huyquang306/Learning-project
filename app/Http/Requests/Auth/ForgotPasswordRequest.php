<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseApiRequest;

class ForgotPasswordRequest extends BaseApiRequest
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
            'email' => 'required|email:filter|exists:m_shop,email',
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
        return [];
    }

    /**
     * Custom message for rules
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'email.exists' => 'Vui lòng nhập địa chỉ email đã đăng ký của bạn',
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
