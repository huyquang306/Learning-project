<?php

namespace App\Repositories;

use App\Models\MShop;
use App\Models\MShopBusinessHour;
use App\Models\MShopBusinessHourPrice;
use App\Repositories\Interfaces\BusinessHourRepositoryInterface;

class BusinessHourRepository extends BaseRepository implements BusinessHourRepositoryInterface
{

    public function getModel(): string
    {
        return MShopBusinessHour::class;
    }

    /**
     * @param int $shopId
     * @return \Illuminate\Support\Collection
     */
    public function getListByShopId(int $shopId): \Illuminate\Support\Collection
    {
        return $this->model->where('m_shop_id', $shopId)->get();
    }

    /**
     * @param array $businessHours
     * @param MShop $mShop
     * @return mixed
     */
    public function updateBusinesses(array $businessHours, MShop $mShop)
    {
        $businessIds = [];
        foreach ($businessHours as $businessData) {
            $businessData = collect($businessData)->only([
                'id',
                'name',
                'start_time',
                'finish_time',
            ])->toArray();

            if (!array_key_exists('id', $businessData) || !$businessData['id']) {
                $businessData['hash_id'] = $this->makeHashId();
            }
            $businessData['m_shop_id'] = $mShop->id;
            $startTime = Carbon::parse($businessData['start_time'])->format('H:i:s');
            $finishTime = Carbon::parse($businessData['finish_time'])->format('H:i:s');
            $businessData['overday_flg'] = ($startTime > $finishTime) ? $this->model::OVERDAY_FLAG_ON : $this->model::OVERDAY_FLAG_OFF;

            $updateBusiness = $this->updateOrCreate([
                'id' => $businessData['id'],
            ], $businessData);
            $businessIds[] = $updateBusiness->id;
        }
        $businessIdsInDB = $this->getListByShopId($mShop->id)->pluck('id')->toArray();
        $removeBusinessIds = array_diff($businessIdsInDB, $businessIds);
        $this->model->whereIn('id', $removeBusinessIds)->delete();

        return $this->model->find($businessIds);
    }

    public function getBusinessHourPricesOfBusinessHourIds(array $businessHourIds)
    {
        return MShopBusinessHourPrice::whereIn('m_shop_business_hour_id', $businessHourIds)->get();
    }
}