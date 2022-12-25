<?php

/**
 * Create a string as hash_id
 *
 * @return string|null
 */
function makeHash(): ?string
{
    $length = config('const.LENGTH_OF_HASH_ID');
    $str = array_merge(range('a', 'z'), range('0', '9'));
    $result = null;

    for ($i = 0; $i < $length; $i++) {
        $result .= $str[rand(0, count($str) - 1)];
    }

    return $result;
}
