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

/**
 * @param string $intTimestamp
 * @param int $getDay
 * @param int $getDate
 * @param int $getTime
 * @return false|string
 */
function getDateTime($intTimestamp = "", $getDay = 1, $getDate = 1, $getTime = 1)
{
    if ($intTimestamp != "") {
        $today = getdate($intTimestamp);
        $day = $today["wday"];
        $date = date("d-m-Y", $intTimestamp);
        $time = date("H:i", $intTimestamp);
    } else {
        $today = getdate();
        $day = $today["wday"];
        $date = date("d-m-Y", $intTimestamp);
        $time = date("H:i");
    }
    $dayArray = array("Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy");
    $strDateTime = "";
    for ($i = 0; $i <= 6; $i++) {
        if ($i == $day) {
            /*if ($getDate != 0) {
                $strDateTime .= $date . "(";
            }
            if ($getDay != 0) {
                $strDateTime .= $dayArray[$i] . ") ";
            }
            if ($getTime != 0) {
                $strDateTime .= $time . "";
            }
            if (substr($strDateTime, -2, 2) == ", ") {
                $strDateTime = substr($strDateTime, 0, -2);
            }*/
            $strDateTime = "($dayArray[$i]) $date $time";

            return $strDateTime;
        }
    }
}

/**
 * Generate Invoice Code
 *
 * @param date $createdAt
 * @param int $orderGroupId
 *
 * @return string
 */
function makeInvoiceCode($createdAt, $orderGroupId): string
{
    $orderDate = \Carbon\Carbon::parse($createdAt)->format('ymd');
    $orderCode = sprintf("%04d", $orderGroupId);
    $invoiceCode = $orderDate . $orderCode;

    return $invoiceCode;
}

/**
 * Get Cputil path
 *
 * @return string
 */
function getCputilPath(): string
{
    if (substr(PHP_OS, 0, 3) == 'WIN') {
        if (file_exists(dirname(__FILE__) . '\cputil\cputil.exe')) {
            $cputilpath = 'C:\cputil/cputil/cputil.exe';
        } else {
            $cputilpath = 'C:\cputil/cputil.exe';
        }
    } else {
        if (file_exists(dirname(__FILE__) . '/cputil/cputil')) {
            $cputilpath = '/opt/star/cputil/cputil/cputil';
        } else {
            $cputilpath = '/opt/star/cputil/cputil';
        }
    }
    return $cputilpath;
}
