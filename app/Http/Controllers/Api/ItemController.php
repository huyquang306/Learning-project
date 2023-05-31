<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopItemRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Models\MItem;
use App\Models\MShop;
use App\Services\ImageService;
use Illuminate\Http\Request;
use App\Services\ShopItemService;
use Illuminate\Support\Facades\Log;

class ItemController extends Controller
{
    protected $shop_item_service, $image_service;

    public function __construct(
        ShopItemService $shop_item_service,
        ImageService $image_service

    ) {
        $this->shop_item_service = $shop_item_service;
        $this->image_service = $image_service;
    }

    /**
     * @param MShop $shop
     * @return array
     */
    public function index(MShop $shop): array
    {
        return [
            "status" => 'success',
            "message" => '',
            "result" => $shop->mItems()->get() ? : null
        ];
    }

    /**
     * @param ShopItemRequest $request
     * @param MShop $shop
     * @return array
     */
    public function create(ShopItemRequest $request, MShop $shop): array
    {
        try {
            $response = $this->shop_item_service->createItem($request, $shop);
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

        return [
            'status' => 'success',
            'message' => '',
            'result' => $response
        ];
    }

    public function updateImages(UpdateImageRequest $request, string $shop_id, string $item_id): array
    {
        $file = $request->file('file');

        try {
            $image_size_paths = $this->image_service->resizeImages($shop_id, $item_id, $file, 'item');

            if(!$image_size_paths) throw new Exception('Failed to resize image and save locally.');

            $s3_paths = $this->image_service->s3UploadImages($shop_id, $image_size_paths);
            \File::delete(array_column($image_size_paths, 'local_path'));

            $path = $this->image_service->updateImagePaths($shop_id, $item_id, $s3_paths, 'item');
            if(!$path) throw new Exception("Error DB Save");

            // DBの更新　返り値はMItem
            return [
                'status'  => 'success',
                'message' => '',
                'result'  => $path
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
                'result'  => [ 'detail' => $e->getMessage() ]
            ];
        }
    }

    /**
     * @param MShop $shop
     * @param MItem $item
     * @return array
     */
    public function destroy(MShop $shop, MItem $item): array
    {
        try {
            $response = $this->shop_item_service->deleteItem($shop->id, $item->id);
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

        return [
            'status' => 'success',
            'message' => '',
            'result' => $response
        ];
    }

    /**
     * @param ShopItemRequest $request
     * @param MShop $shop
     * @param MItem $item
     * @return array
     */
    public function update(ShopItemRequest $request, MShop $shop, MItem $item): array
    {
        try {
            $response = $this->shop_item_service->updateItem($request, $shop->id, $item->id);
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

        return [
            'status' => 'success',
            'message' => '',
            'result' => $response
        ];
    }
}
