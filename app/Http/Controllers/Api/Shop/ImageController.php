<?php

namespace App\Http\Controllers\Api\Shop;

use App\Http\Controllers\BaseApiController;
use App\Http\Requests\Shop\ImageRequest;
use App\Http\Resources\Shop\UploadImageResource;
use App\Models\MShop;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;

class ImageController extends BaseApiController
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Create a new image
     *
     * @param ImageRequest $request
     * @param MShop        $shop
     *
     * @return JsonResponse
     */
    public function store(ImageRequest $request, MShop $shop): JsonResponse
    {
        $imagePath = $this->imageService->uploadAndCreateImage($shop, $request->file);

        return $this->responseApi(new UploadImageResource($imagePath));
    }
}
