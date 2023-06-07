<?php

namespace App\Repositories\Interfaces;

use App\Models\MShop;

interface AnnouncementRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get list by shopId
     *
     * @param  int $shopId
     * @return \Illuminate\Support\Collection
     */
    public function getListByShopId(int $shopId);

    /**
     * Update Announcements
     *
     * @param  MShop $shop
     * @param  array $announcementsData
     * @return \Illuminate\Support\Collection
     */
    public function updateAnnouncements(MShop $shop, array $announcementsData);

    /**
     * Get a Announcement suitable now
     *
     * @param  MShop $shop
     * @return \Illuminate\Support\Collection
     */
    public function getSuitableTime(MShop $shop);
}
