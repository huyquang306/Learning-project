<?php

namespace App\Services;

use App\Models\MShop;
use App\Repositories\ShopRepository;

class GenreService
{
    protected $shopRepository;

    public function __construct(ShopRepository $shopRepository)
    {
        $this->shopRepository = $shopRepository;
    }

    /**
     * @param string $code
     * @return mixed
     */
    public function getGenre(string $code=null)
    {
        return $this->shopRepository->getGenre($code);
    }

    /**
     * @param MShop $m_shop
     * @param array $genre_codes
     * @return MShop
     */
    public function saveGenre(MShop $m_shop, array $genre_codes): MShop
    {
        return $this->shopRepository->saveGenre($m_shop, $genre_codes);
    }
}
