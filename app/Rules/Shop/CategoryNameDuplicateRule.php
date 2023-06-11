<?php

namespace App\Rules\Shop;

use App\Models\MMenuCategory;
use Illuminate\Contracts\Validation\Rule;

class CategoryNameDuplicateRule implements Rule
{
    protected $shop;
    protected $category;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($shop, $category = null)
    {
        $this->shop = $shop;
        $this->category = $category;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        $tierNumber = request()->get('tier_number', 1);
        $parentId = request()->get('parent_id', 0);
        if ($this->shop && $this->shop->id) {
            $isHasCategory = MMenuCategory::where('name', $value)
                ->where('m_shop_id', $this->shop->id)
                ->where('tier_number', $tierNumber)
                ->where('parent_id', $parentId);

            if ($this->category) {
                $isHasCategory = $isHasCategory->where('id', '<>', $this->category->id);
            }

            return !$isHasCategory->exists();
        }

        return false;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Tên này đã tồn tại';
    }
}
