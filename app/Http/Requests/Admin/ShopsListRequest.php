<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseApiRequest;

class ShopsListRequest extends BaseApiRequest
{
    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesGet(): array
    {
        return [
            'from' => 'nullable|string|date',
            'to' => 'nullable|string|date',
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
