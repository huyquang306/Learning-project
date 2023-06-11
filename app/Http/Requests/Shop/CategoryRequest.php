<?php

namespace App\Http\Requests\Shop;

use App\Rules\Shop\CategoryNameDuplicateRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class CategoryRequest extends FormRequest
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
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {
        $validate = [];
        switch ($request->method()) {
            case 'GET':
                $validate = [
                    'tier_number' => ['required', 'numeric'],
                    'parent_id' => ['numeric']
                ];
                break;
            case 'POST':
                $validate = [
                    'name' => [
                        'string',
                        'max:50',
                        new CategoryNameDuplicateRule($this->shop),
                    ],
                    'short_name' => ['nullable', 'string', 'max:10'],
                    'parent_id' => ['exists:m_menu_category,id', 'numeric'],
                    'tier_number' => ['required', 'numeric'],
                ];
                break;
            case 'PUT':
                $validate = [
                    'name' => [
                        'string',
                        'max:10',
                        new CategoryNameDuplicateRule($this->shop, $this->category),
                    ],
                    'parent_id' => ['exists:m_menu_category,id', 'numeric'],
                    'short_name' => ['nullable', 'string', 'max:10'],
                    'tier_number' => ['numeric'],
                ];
                // Case update parent category
                if ($this->parent_id == 0) {
                    $validate['parent_id'] = [];
                }
                break;
            default:
                $validate = [];
                break;
        }

        return $validate;
    }
}
