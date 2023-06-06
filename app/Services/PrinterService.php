<?php

namespace App\Services;

use App\Models\MPrinter;
use App\Models\MShopMeta;
use App\Models\TOrder;
use App\Repositories\Interfaces\AnnouncementRepositoryInterface;
use App\Repositories\Interfaces\ShopMetaRepositoryInterface;
use App\Repositories\OrderGroupRepository;
use App\Repositories\OrderRepository;
use App\Repositories\PrinterRepository;
use App\Repositories\ShopRepository;
use App\Repositories\MenuRepository;
use Illuminate\Support\Carbon;

class PrinterService
{
    protected $printerRepository;
    protected $ordergroupRepository;
    protected $orderRepository;
    protected $shopRepository;
    protected $orderGroupService;
    protected $announcementRepository;
    protected $shopMetaRepository;
    protected $menuRepository;

    public function __construct(
        PrinterRepository $printerRepository,
        OrderGroupRepository $orderGroupRepository,
        OrderRepository $orderRepository,
        ShopRepository $shopRepository,
        AnnouncementRepositoryInterface $announcementRepository,
        ShopMetaRepositoryInterface $shopMetaRepository,
        MenuRepository $menuRepository,
        OrderGroupService $orderGroupService
    ) {
        $this->printerRepository = $printerRepository;
        $this->ordergroupRepository = $orderGroupRepository;
        $this->orderRepository = $orderRepository;
        $this->shopRepository = $shopRepository;
        $this->announcementRepository = $announcementRepository;
        $this->shopMetaRepository = $shopMetaRepository;
        $this->menuRepository = $menuRepository;
        $this->orderGroupService = $orderGroupService;
    }

    /**
     * Create barcode template
     *
     * @param $shop
     * @param $order_group
     * @param $add_hash_id
     * @return false|string
     */
    public function createBarCodeTemplate($shop, $order_group, $add_hash_id)
    {
        $printersFolderPath = $this->getPrintersFolderPath();
        // Get base url of smart order site
        $m_table_code = $this->ordergroupRepository->getTableCode($add_hash_id);
        \Log::info($m_table_code);
        $m_table_code = implode(',', $m_table_code->toArray());

        $smartOrderUrl = env('SMART_ORDER_APP_URL', '');
        $customerUrl = $smartOrderUrl . '/shop-order/register?redirect_url=' . $shop->hash_id
            . '&ordergroup_hash_id=' . $order_group->hash_id
            . '&shop_name=' . urlencode($shop->name)
            . '&table_code=' . urlencode($m_table_code);

        $date = $order_group->created_at
            ? Carbon::parse($order_group->created_at)->format('Y/m/d H:i')
            : '';
        $output_format = 'application/vnd.star.starprnt';
        $cputil_path = getCputilPath();
        $printer = $this->printerRepository->getBarcodePrinter($shop->id);
        $base_file = tempnam($printersFolderPath, "markup");
        $markup_file = $base_file . ".stm";
        $output_file = tempnam($printersFolderPath, "output");

        $wifi_name = $shop->wifi_name;
        $wifi_pass = $shop->wifi_pass;
        $file = fopen($markup_file, 'w+');
        if ($file != false) {
            fwrite($file, "[align: centre][bold: on]" . $shop->name . "[bold: off]\n\n");
            fwrite($file, "[align]Số bàn : " . $m_table_code . "\n");
            fwrite($file, "[align]Thời gian : " . $date . "\n\n");

            // print QR code
            fwrite($file, "[align: centre][bold: on][mag]↓↓Nhấn vào đây↓↓[bold: off]\n\n");
            fwrite(
                $file,
                "[align: centre][barcode: type qr; data " . $customerUrl . "; width 100%; module 5]"
            );
            fwrite($file, "[align: centre][mag]※QR code\n\n");

            // print Wifi
            if ($wifi_name) {
                fwrite($file, "[align]WiFi\n");
                fwrite($file, "[align]SSID: $wifi_name\n");
                if ($wifi_pass) {
                    fwrite($file, "[align]Pass: $wifi_pass\n");
                }
            }
            fwrite($file, "\n");
            fwrite($file, "[align: centre]--------------------------------\n\n");

            // print announcement
            $announcement = $this->announcementRepository->getSuitableTime($shop);
            if ($announcement) {
                fwrite($file, "[align][bold: on]●Hướng dẫn từ cửa hàng[bold: off]\n");
                fwrite($file, "[align][mag]" . $announcement->content . "\n\n");
            }

            // menus recommend
            $recommendMenus = $this->menuRepository->getMenuRecommendWithCategories($shop->id);
            if ($recommendMenus && count($recommendMenus)) {
                fwrite($file, "[align][bold: on]●Thực đơn gợi ý[bold: off]\n");
                foreach ($recommendMenus as $menu) {
                    fwrite($file, "[column: left " . $menu->name . "; right " . $menu->price . "円]\n");
                }
                fwrite($file, "\n");
            }

            // print sns_links
            $snsLinks = $this->shopMetaRepository->getShopMetaByKey($shop->id, MShopMeta::SNS_LINK_TYPE);
            if ($snsLinks && count($snsLinks)) {
                foreach ($snsLinks as $snsLink) {
                    if ($snsLink && $snsLink->name && $snsLink->link) {
                        fwrite($file, "[align][bold: on]●" . $snsLink->name . "[bold: off]\n");
                        fwrite($file, "[align]" . $snsLink->description . "\n\n");
                        fwrite(
                            $file,
                            "[align: centre][barcode: type qr; data " . $snsLink->link . "]"
                        );
                    }
                }
            }

            fwrite($file, "[cut]");
            fclose($file);
        }

        $options = $this->getPrinterOption($printer);
        $command = $cputil_path . " " . $options . " decode \"" . $output_format . "\" \"" . $markup_file . "\" \"" . $output_file . "\"";
        system($command, $retval);

        return $output_file;
    }

    /**
     * @return string
     */
    public function getPrintersFolderPath(): string
    {
        try {
            // obentor data folder
            $folderPath = 'data/orderr/';
            if (!is_dir($folderPath)) {
                mkdir($folderPath, 0766, true);
            }

            // folderPath is /data/orderr/printers
            $folderPath .= config('const.printers_folder_name');
            if (!is_dir($folderPath)) {
                mkdir($folderPath, 0766, true);
            }

            return $folderPath;
        } catch (Exception $exception) {
            \Log::error('Do not setup printer folder!');

            return '/tmp';
        }
    }

    /**
     * Get printer option
     *
     * @param $printer
     * @return string
     */
    public function getPrinterOption($printer): string
    {
        $printer_width = $printer->width ?? 384;
        $options = "";
        if ($printer_width <= (58 * 8)) {
            $options = $options . "thermal2";
        } elseif ($printer_width <= (72 * 8)) {
            $options = $options . "thermal3";
        } elseif ($printer_width <= (82 * 8)) {
            $options = $options . "thermal82";
        } elseif ($printer_width <= (112 * 8)) {
            $options = $options . "thermal4";
        }

        return $options . " scale-to-fit dither ";
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
        // check if shop can use printer
        if (!$this->checkShopCanUsePrinter($shop_id)) {
            return;
        }

        // check printer by position
        $printers = $this->printerRepository->getPrintersByFilter($shop_id, [
            'position' => $position,
            'status' => MPrinter::STATUS_ENABLE,
        ]);
        if (count($printers)) {
            $this->printerRepository->insertJobQueue($shop_id, $output_file, $position);
        } else {
            // if shop don't have suitable printer by position, check shop have printer no_select to print
            $noSelectConst = config('const.PRINTER_POSITIONS.NO_SELECT.value');
            $noSelectPrinters = $this->printerRepository->getPrintersByFilter($shop_id, [
                'position' => $noSelectConst,
                'status' => MPrinter::STATUS_ENABLE,
            ]);
            if (count($noSelectPrinters)) {
                $this->printerRepository->insertJobQueue($shop_id, $output_file, $noSelectConst);
            }
        }
    }

    /**
     * Check if shop can use printer
     *
     * @param int $shopId
     * @return bool
     */
    public function checkShopCanUsePrinter($shopId): bool
    {
        $shop = $this->shopRepository->find($shopId);
        $servicePlan = $this->shopRepository->getCurrentApplyServicePlan($shop);

        if ($servicePlan) {
            $canUsePrinter = $servicePlan->rFunctionConditions->first(function ($condition) {
                return $condition->mConditionType
                    && $condition->mConditionType->name === MConditionType::TYPE_USABLE
                    && $condition->is_restricted
                    && $condition->mFunction
                    && $condition->mFunction->code === MFunction::FUNCTION_CODE_PRINTER;
            });

            return !!$canUsePrinter;
        }

        return false;
    }

    /**
     * Create Order By Course Template
     *
     * @param $shop
     * @param $ordergroup
     * @param $course
     * @return false|string
     */
    public function createOrderByCourseTemplate($shop, $ordergroup, $course)
    {
        $printersFolderPath = $this->getPrintersFolderPath();
        $tableCodes = $ordergroup->mTables->pluck('code')->toArray();
        $codeStr = implode(',', $tableCodes);
        $outputFormat = 'application/vnd.star.starprnt';
        $cputilPath = getCputilPath();
        $printer = $this->printerRepository->getOrderPrinter($shop->id);
        $baseFile = tempnam($printersFolderPath, "markup");
        $markupFile = $baseFile . ".stm";
        $outputFile = tempnam($printersFolderPath, "output");
        $orderTime = Carbon::parse($ordergroup->start_time)->format('H:i');
        $numberOfCustomer = $ordergroup->number_of_customers;
        $courseName = $course->name ?? '';

        $file = fopen($markupFile, 'w+');
        if ($file != false) {
            fwrite($file, "[align: centre][font: a]");
            fwrite($file, "[column: left: " . $orderTime . ";right: Số bàn：" . $codeStr . "]\n\n");
            fwrite($file, "[bold: on][column: left: ○Tổng○;right: Số lượng]\n");
            fwrite($file, "[mag]--------------------------------[mag]\n");
            fwrite($file, "[bold: on][column: left: " . $courseName . ";right: " . $numberOfCustomer . "]\n\n");
            fwrite($file, "[cut]");
            fclose($file);
        }

        $options = $this->getPrinterOption($printer);
        $command = $cputilPath . " " . $options . " decode \"" . $outputFormat . "\" \"" . $markupFile . "\" \"" . $outputFile . "\"";
        system($command, $retval);

        return $outputFile;
    }

    /**
     * Create Order template
     *
     * @param $shop
     * @param $ordergroup
     * @param $orders
     * @param $type
     * @param $oldOrders
     * @return false|string
     */
    public function createCreateOrderTemplate($shop, $ordergroup, $orders, $type, $oldOrders = [])
    {
        if ($type === TOrder::UPDATE_ORDER_TYPE) {
            $orderType = "○Thay đổi○";
        } elseif ($type === TOrder::CANCEL_ORDER_TYPE) {
            $orderType = "X Hủy bỏ X";
        } else {
            // Add order (2nd time)
            $orderType = "○Thêm món○";
        }

        $printersFolderPath = $this->getPrintersFolderPath();
        $tableCodes = $ordergroup->mTables->pluck('code')->toArray();
        $codeStr = implode(',', $tableCodes);
        $outputFormat = 'application/vnd.star.starprnt';
        $cputilPath = getCputilPath();
        $printer = $this->printerRepository->getOrderPrinter($shop->id);
        $baseFile = tempnam($printersFolderPath, "markup");
        $markupFile = $baseFile . ".stm";
        $outputFile = tempnam($printersFolderPath, "output");
        $orderTime = Carbon::parse(now())->format('H:i');
        $listFirstIdOrdersOfOrdergroup = $this->orderGroupService->getListFirstOrdersOfOrdergroup($ordergroup) ?? [];

        $file = fopen($markupFile, 'w+');
        if ($file != false) {
            fwrite($file, "[align: left][font: name a]");
            foreach ($orders as $order) {
                $quantity = $order->quantity;

                if ($type === TOrder::ADD_ORDER_TYPE && in_array($order->id, $listFirstIdOrdersOfOrdergroup)) {
                    // Add order (1st time)
                    $orderType = "○Thêm mới：Ưu tiên○";
                }

                if ($type === TOrder::UPDATE_ORDER_TYPE) {
                    foreach ($oldOrders as $oldOrder) {
                        if ($oldOrder->id = $order->id) {
                            $quantity = "$oldOrder->quantity -> $order->quantity";
                            if ($order->quantity < $oldOrder->quantity) {
                                $orderType = "X Thay đổi X";
                                break;
                            }
                        }
                    }
                }

                $orderName = '';
                switch ($order->order_type) {
                    case config('const.ORDER_TYPE.ORDER_COURSE'):
                    case config('const.ORDER_TYPE.ORDER_EXTEND_COURSE'):
                        $orderName = $order->rShopCourse->mCourse->name;
                        break;
                    case config('const.ORDER_TYPE.ORDER_MENU'):
                        $orderName = $order->rShopMenu->mMenu->name;
                        break;
                    case config('const.ORDER_TYPE.ORDER_SERVICE_FEE'):
                        $orderName = config('const.ORDER_SERVICE_FEE_NAME');
                        break;
                    case config('const.ORDER_TYPE.ORDER_WITHOUT_MENU'):
                        $orderName = $order->menu_name;
                        break;
                    default:
                        break;
                }

                if ($order->r_shop_course_id && $order->r_shop_menu_id) {
                    // Case: Print Ordered in Course
                    $orderName = $orderName . "(0 VND)";
                }

                fwrite($file, "[column: left: " . $orderTime . ";right: Số bàn：" . $codeStr . "]\n\n");
                fwrite($file, "[mag][bold: on][column: left: " . $orderType . ";right: Số lượng][mag]\n");
                fwrite($file, "[mag]--------------------------------[mag]\n");
                fwrite($file, "[bold: on][column: left: " . $orderName . ";right: " . $quantity . "]\n\n");
                fwrite($file, "[cut]");
            }
            fclose($file);
        }

        $options = $this->getPrinterOption($printer);
        $command = $cputilPath . " " . $options . " decode \"" . $outputFormat . "\" \"" . $markupFile . "\" \"" . $outputFile . "\"";
        system($command, $retval);

        return $outputFile;
    }
}
