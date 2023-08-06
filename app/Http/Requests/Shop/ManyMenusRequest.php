<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class ManyMenusRequest extends BaseApiRequest
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
            'menus' => 'array',
            'menus.*.id' => 'nullable|exists:m_menu,id',
            'menus.*.name' => 'required|string|max:30',
            'menus.*.price' => 'required|integer|min:0',
            'menus.*.status' => 'required|string',
            'menus.*.m_menu_category_ids' => 'required|array|size:2',
            'menus.*.m_menu_category_ids.*' => 'exists:m_menu_category,id',
            'menus.*.tax_value' => 'numeric|min:0|lte:menus.*.price',
            'menus.*.m_tax_id' => 'exists:m_tax,id',
            'menus.*.add_images' => 'array',
            'menus.*.add_images.*' => 'string',
            'menus.*.main_image_path' => 'nullable|string',
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
