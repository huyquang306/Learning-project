<?php

namespace App\Services\User;

class PrinterService
{
    public function getPrintersFolderPath(): string
    {
        try {
            $folderPath = '/data/orderr/';
            if (!is_dir($folderPath)) {
                mkdir($folderPath, 0766, true);
            }

            $folderPath .= config('const.printers_folder_name');
            if (!is_dir($folderPath)) {
                mkdir($folderPath, 0766, true);
            }

            return $folderPath;
        } catch (Exception $exception) {
            Log::error('Do not setup printer folder!');

            return '/tmp';
        }
    }
}
