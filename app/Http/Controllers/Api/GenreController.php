<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopGenreRequest;
use App\Services\GenreService;
use App\Services\ShopService;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    protected $genre_service, $shop_service;

    public function __construct(
        GenreService $genre_service,
        ShopService $shop_service
    ) {
        $this->genre_service = $genre_service;
        $this->shop_service = $shop_service;
    }

    /**
     * @param $code
     * @return array
     */
    public function index($code=null)
    {
        $response = $this->genre_service->getGenre($code);
        if ($response) {
            $status = 'success';
            $message = '';
            $result = $response;
        } else {
            $status  = 'failure';
            $message = 'invalid_param';
            $result  = ['fields' => 'genre', 'errorCode' => 'invalid_param'];
        }

        return [
            'status' => $status,
            'message' => $message,
            'result' => $result
        ];
    }

    /**
     * @param ShopGenreRequest $request
     * @param $shop_id
     * @return array
     */
    public function store(ShopGenreRequest $request, $shop_id)
    {
        $m_shop = $this->shop_service->find($shop_id);
        try {
            return [
                'status' => 'success',
                'message' => '',
                'result' => $this->genre_service
                    ->saveGenre(
                        $m_shop,
                        is_array($request->genre)
                            ? $request->genre
                            : [$request->genre]
                    ),
            ];

        }
        catch(\PDOException $e)
        {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => []
            ];
        }
        catch(\Exception $e)
        {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => [],
            ];
        }
    }

    public function update(ShopGenreRequest $request, string $shop_id)
    {
        $m_shop = $this->shop_service->find($shop_id);
        try {
            return [
                'status' => 'success',
                'message' => '',
                'result' => $this->genre_service
                    ->saveGenre(
                        $m_shop,
                        is_array($request->genre)
                            ? $request->genre
                            : [$request->genre]
                    ),
            ];

        }
        catch(\PDOException $e)
        {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => []
            ];
        }
        catch(\Exception $e)
        {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => []
            ];
        }
    }

    public function show(ShopGenreRequest $request, string $shop_id)
    {
        $m_shop = $this->shop_service->find($shop_id);
        try {
            return [
                'status' => 'success',
                'message' => '',
                'result' => $m_shop->mGenres()->get() ?: ''
            ];

        }
        catch(\PDOException $e)
        {
            return [
                'status'  => 'failure',
                'message' => 'pdo_exception',
                'result'  => []
            ];
        }
        catch(\Exception $e)
        {
            return [
                'status'  => 'failure',
                'message' => 'exception',
                'result'  => []
            ];
        }
    }
}
