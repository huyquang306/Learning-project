<?php

namespace App\Rules\Shop\Menu;

use Illuminate\Contracts\Validation\Rule;

class MenuInitialOrderFlgOnNotInCourseRule implements Rule
{
    protected $menu;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($menu = null)
    {
        $this->menu = $menu;
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
        if ($value && $this->menu) {
            $menu = $this->menu;
            $menu->load('mCourses');

            return !count($menu->mCourses);
        }

        // Pass when off initial_order_flg
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'Món ăn này nằm trong set ăn nên không thể order riêng';
    }
}
