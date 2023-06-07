<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\MShopBusinessHour;
use App\Models\TShopAnnouncement;
use App\Repositories\Interfaces\AnnouncementRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Carbon;

class AnnouncementRepository extends BaseRepository implements AnnouncementRepositoryInterface
{

    public function getModel(): string
    {
        return TShopAnnouncement::class;
    }

    /**
     * Get list of shop
     *
     * @param int $shopId
     * @return \Illuminate\Support\Collection
     */
    public function getListByShopId(int $shopId): \Illuminate\Support\Collection
    {
        return $this->model->where('m_shop_id', $shopId)
            ->with('mShopBusinessHours')
            ->get();
    }

    /**
     * Update Announcements
     *
     * @param MShop $mShop
     * @param array $announcementsData
     * @return Collection
     */
    public function updateAnnouncements(MShop $mShop, array $announcementsData): \Illuminate\Support\Collection
    {
        $announcementIds = [];
        foreach ($announcementsData as $announcementData) {
            $announcementData = collect($announcementData)->only([
                'id',
                'content',
                'businessHourIds',
            ])->toArray();
            if (!array_key_exists('id', $announcementData) || !$announcementData['id']) {
                $announcementData['hash_id'] = $this->makeHashId();
            }
            $announcementData['m_shop_id'] = $mShop->id;

            $updateAnnouncement = $this->updateOrCreate([
                'id' => $announcementData['id'],
            ], $announcementData);

            // update relationship
            $relationshipQuery = MShopBusinessHour::where('t_shop_announcement_id', $updateAnnouncement->id);
            if ($relationshipQuery->exists()) {
                $relationshipQuery->update(['t_shop_announcement_id' => null]);
            }
            MShopBusinessHour::whereIn('id', $announcementData['businessHourIds'])
                ->update(['t_shop_announcement_id' => $updateAnnouncement->id]);
            $announcementIds[] = $updateAnnouncement->id;
        }
        $announcementIdsInDB = $this->getListByShopId($mShop->id)->pluck('id')->toArray();

        // remove announcement and remove relationship
        $removeAnnounceIds = array_diff($announcementIdsInDB, $announcementIds);
        MShopBusinessHour::whereIn('t_shop_announcement_id', $removeAnnounceIds)->update([
            't_shop_announcement_id' => null,
        ]);
        $this->model->whereIn('id', $removeAnnounceIds)->delete();

        return $this->model->find($announcementIds)->load('mShopBusinessHours');
    }

    /**
     * Get a Announcement suitable now
     *
     * @param  MShop $shop
     * @return mixed
     */
    public function getSuitableTime(MShop $shop)
    {
        $date = Carbon::now()->format('d-m-Y');
        $nextDate = Carbon::now()->addDay()->format('d-m-Y');
        $now = Carbon::now();

        $businesses = MShopBusinessHour::where('m_shop_id', $shop->id)->get();
        if (count($businesses)) {
            $business = null;
            foreach ($businesses as $businessTmp) {
                $startTime = Carbon::parse($date . ' ' . $businessTmp->start_time);
                $finishTime = Carbon::parse($date . ' ' . $businessTmp->finish_time);
                // gte is greater than or equals
                if ($startTime->gte($finishTime)) {
                    $finishTime = Carbon::parse($nextDate . ' ' . $businessTmp->finish_time);
                }
                if ($now->gte($startTime) && $finishTime->gte($now)) {
                    $business = $businessTmp;
                }
            }

            if ($business) {
                return $this->model->where('m_shop_id', $shop->id)
                    ->where('id', $business->t_shop_announcement_id)
                    ->first();
            }
        } else {
            // get announcement that is all shop time

            return $this->model->where('m_shop_id', $shop->id)->first();
        }
    }
}
