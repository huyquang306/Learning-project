<?php

namespace App\Rules\Shop\Course;

use App\Models\MMenu;
use Illuminate\Contracts\Validation\Rule;

class MenuHasInitialOrderFlgOffRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
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
        $menu = MMenu::where('hash_id', $value)
            ->where('initial_order_flg', MMenu::INITIAL_ORDER_MENU_FLAG_FALSE)
            ->first();

        return (bool)$menu;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'Đây là thực đơn thuộc set ăn nên không thể order riêng';
    }
}
