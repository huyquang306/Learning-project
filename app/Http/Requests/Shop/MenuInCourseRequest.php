<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;
use App\Rules\Shop\Course\MenuHasInitialOrderFlgOffRule;

class MenuInCourseRequest extends BaseApiRequest
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
            'list_menus' => 'required|array',
            'list_menus.*.menu_hash_id' => [
                'required',
                'exists:m_menu,hash_id',
                new MenuHasInitialOrderFlgOffRule(),
            ],
            'list_menus.*.status' => 'string|max:10',
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
