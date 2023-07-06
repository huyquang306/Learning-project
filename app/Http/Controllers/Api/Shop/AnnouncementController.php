<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\AnnouncementsRequest;
use App\Http\Resources\Shop\AnnouncementResource;
use App\Models\MShop;
use App\Models\TShopAnnouncement;
use App\Services\Shop\AnnouncementService;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends BaseAPIController
{
    protected $announcementService;

    /**
     * AnnouncementController constructor.
     * @param AnnouncementService $announcementService
     */
    public function __construct(AnnouncementService $announcementService)
    {
        $this->announcementService = $announcementService;
    }

    /**
     * Get all Announcements by shop id
     *
     * @param  MShop $shop
     * @return JsonResponse
     */
    public function index(MShop $shop)
    {
        $announcements = $this->announcementService->getList($shop);

        return $this->responseApi(AnnouncementResource::collection($announcements));
    }

    /**
     * Update Announcements
     *
     * @param  AnnouncementsRequest $request
     * @param  MShop                $shop
     * @return JsonResponse
     */
    public function update(AnnouncementsRequest $request, MShop $shop)
    {
        $announcements = $this->announcementService->updateAnnouncements($shop, $request->announcements);

        return $this->responseApi(AnnouncementResource::collection($announcements));
    }
}
