<?php

namespace App\Http\Requests\Shop;

use App\Http\Requests\BaseApiRequest;

class ImageRequest extends BaseApiRequest
{
    /**
     * rulesPost
     * handle rule method post
     *
     * @return array
     */
    public function rulesPost(): array
    {
        $fileRule = 'required|bail|file|mimes:jpeg,png,jpg,gif,bmp|max:10240';
        $base64Rule = 'required|base64image|base64mimes:jpeg,png,jpg,gif,bmp|base64max:10240';
        try {
            if (base64_decode($this->file, true) !== false) {
                return [
                    'file' => $fileRule,
                ];
            }

            return [
                'file' => $base64Rule,
            ];
        } catch (\Exception $exception) {
            return [
                'file' => $fileRule,
            ];
        }
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
