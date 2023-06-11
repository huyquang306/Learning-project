<?php

namespace App\Services\Shop;
use App\Models\MShop;
use App\Models\MShopCookPlace;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Interfaces\ShopCookPlaceRepositoryInterface as ShopCookPlaceRepository;

class CookPlaceService
{
    protected $cookPlaceRepository;

    public function __construct(ShopCookPlaceRepository $cookPlaceRepository)
    {
        $this->cookPlaceRepository = $cookPlaceRepository;
    }

    /**
     * Get list data of cook_places
     * @param MShop $shop
     *
     * @return Collection|null
     */
    public function getListOfShop(MShop $shop): ?Collection
    {
        return $this->cookPlaceRepository->getListOfShop($shop);
    }

    /**
     * Create a new cook_place
     * @param Request $request
     * @param MShop   $shop
     *
     * @return MShopCookPlace|null
     */
    public function create(Request $request, MShop $shop): ?MShopCookPlace
    {
        try {
            DB::beginTransaction();
            $attributes = $request->only([
                'name',
            ]);
            $attributes['m_shop_id'] = $shop->id;
            $attributes['hash_id'] = $this->cookPlaceRepository->makeHashId();
            $newCookPlace = $this->cookPlaceRepository->create($attributes);
            DB::commit();

            return $newCookPlace;
        } catch (Exception $e) {
            DB::rollBack();

            return null;
        }
    }

    /**
     * Update a cook_place
     * @param Request $request
     * @param MShopCookPlace $mShopCookPlace
     *
     * @return MShopCookPlace
     */
    public function update(Request $request, MShopCookPlace $mShopCookPlace): MShopCookPlace
    {
        try {
            DB::beginTransaction();
            $attributes = $request->only(['name']);
            $newCookPlace = $this->cookPlaceRepository->update($mShopCookPlace->id, $attributes);
            DB::commit();

            return $newCookPlace;
        } catch (Exception $e) {
            DB::rollBack();

            return $mShopCookPlace;
        }
    }

    /**
     * Delete a cook_place
     * @param MShopCookPlace $mShopCookPlace
     *
     * @return bool
     */
    public function delete(MShopCookPlace $mShopCookPlace): bool
    {
        try {
            DB::beginTransaction();
            $this->cookPlaceRepository->delete($mShopCookPlace->id);
            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();

            return false;
        }
    }
}