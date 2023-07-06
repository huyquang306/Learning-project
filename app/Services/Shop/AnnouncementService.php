<?php

namespace App\Services\Shop;

use App\Models\MShop;
use App\Models\MShopBusinessHour;
use App\Models\TShopAnnouncement;
use App\Repositories\AnnouncementRepository;
use Illuminate\Http\Request;

/**
 * Class AnnouncementService
 * @package App\Services\Shop
 */
class AnnouncementService
{
    /**
     * @var AnnouncementRepository
     */
    protected $announcementRepository;

    /**
     * AnnouncementService constructor.
     * @param AnnouncementRepository $announcementRepository
     */
    public function __construct(AnnouncementRepository $announcementRepository)
    {
        $this->announcementRepository = $announcementRepository;
    }

    /**
     * List Announcements by shopId
     *
     * @param  MShop $shop
     * @return \Illuminate\Support\Collection
     */
    public function getList(MShop $shop)
    {
        return $this->announcementRepository->getListByShopId($shop->id);
    }

    /**
     * Update Announcements
     *
     * @param  MShop $shop
     * @param  array $announcements
     * @return \Illuminate\Support\Collection
     */
    public function updateAnnouncements(MShop $shop, array $announcements)
    {
        return $this->announcementRepository->updateAnnouncements($shop, $announcements);
    }
}
