<?php

namespace App\Rules\Shop;

use App\Models\MShop;
use Illuminate\Contracts\Validation\Rule;

class CopyShopByHashIdRule implements Rule
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
        $shop = MShop::where('hash_id', $value)
            ->where('is_active', false)
            ->with('mStaffs')
            ->doesntHave('mStaffs')
            ->first();

        return (bool) $shop;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message(): string
    {
        return 'The selected hash id is invalid.';
    }
}
