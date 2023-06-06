<?php

namespace App\Repositories;

use App\Models\MPrinter;
use App\Models\TPrinterQueue;

class PrinterRepository
{
    /**
     * Get Barcode printer
     *
     * @param $shop_id
     * @return mixed
     */
    public function getBarcodePrinter($shop_id)
    {
        return MPrinter::where('m_shop_id', $shop_id)->first();
    }

    /**
     * Get printer list by shop and filter
     *
     * @param int   $shop_id
     * @param array $filters
     * @return mixed
     */
    public function getPrintersByFilter(int $shop_id, array $filters = [])
    {
        $query = MPrinter::where('m_shop_id', $shop_id);
        if (array_key_exists('position', $filters) && $filters['position']) {
            $query->where('position', $filters['position']);
        }

        if (array_key_exists('status', $filters)) {
            $query->where('status', $filters['status']);
        }

        return $query->get();
    }

    /**
     * Add printer content to queue
     *
     * @param $shop_id
     * @param $output_file
     * @param $position
     */
    public function insertJobQueue($shop_id, $output_file, $position)
    {
        $printer = MPrinter::where('m_shop_id', $shop_id)
            ->where('position', $position)
            ->where('status', MPrinter::STATUS_ENABLE)
            ->first();
        if ($printer != null) {
            $queue = new TPrinterQueue();
            $queue->m_printer_id = $printer->id;
            $queue->hash_id = makeHash();
            $queue->content = $output_file;
            $queue->status = 0;
            $queue->save();
        }
    }

    /**
     * @param $shop_id
     * @return mixed
     */
    public function getOrderPrinter($shop_id)
    {
        return MPrinter::where('m_shop_id', $shop_id)->first();
    }
}
