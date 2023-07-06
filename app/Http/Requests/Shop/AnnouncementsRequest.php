<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class AnnouncementsRequest extends BaseApiRequest
{
    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        return [
            'announcements' => 'nullable|array|max:24',
            'announcements.*.content' => 'required|string|max:100',
            'announcements.*.businessHourIds' => 'nullable|array|max:100',
            'announcements.*.businessHourIds.*' => 'required|numeric|min:1|exists:m_shop_business_hour,id',
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
