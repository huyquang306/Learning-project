<?php

namespace App\Services;

use App\Models\MShop;
use App\Repositories\Interfaces\MImageRepositoryInterface as MImageRepository;
use App\Repositories\ShopRepository;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use Illuminate\Http\UploadedFile;

class ImageService
{
    protected $shopRepository;
    protected $imageRepository;

    public function __construct(
        ShopRepository $shopRepository,
        MImageRepository $imageRepository
    ) {
        $this->shopRepository = $shopRepository;
        $this->imageRepository = $imageRepository;
    }

    /**
     * @param string $shop_id
     * @param string $id
     * @param UploadedFile $file
     * @param string $type
     * @return array
     */
    public function resizeImages(string $shop_id, string $id, UploadedFile $file, string $type): array
    {
        $tmp_dir = public_path() . '/storage';
        if (!file_exists($tmp_dir)) {
            \File::makeDirectory($tmp_dir, 0775, true);
        }

        $image = Image::make($file)->orientate();
        $size_array  = [
            's' => config('const.IMAGE_RESIZE_S'),
            'm' => config('const.IMAGE_RESIZE_M'),
            'l' => config('const.IMAGE_RESIZE_L')
        ];
        $image_size_paths = [];

        $image_ids = self::getUniqImageId($shop_id, $id, array_keys($size_array), $type);

        foreach ($size_array as $key => $value) {
            $local_path = $tmp_dir . '/' . $shop_id . '_' . $image_ids[$key];
            $image_size_paths[$key] = [
                'image_id' => $image_ids[$key],
                'local_path' => $local_path
            ];

            if ($image->height() > $image->width()) {
                Image::make($file)->orientate()->widen($value[0], function ($constraint) {
                    $constraint->aspectRatio();
                })
                    ->fit($value[0], $value[1], null, 'center')
                    ->save($local_path);
            } else {
                Image::make($file)->orientate()->heighten($value[0], function ($constraint) {
                    $constraint->aspectRatio();
                })
                    ->fit($value[0], $value[1], null, 'center')
                    ->save($local_path);
            }
        }

        return $image_size_paths;
    }

    private function getUniqImageId(string $shop_id, string $id, array $sizes, string $type)
    {
        $m_shop = MShop::where('hash_id', $shop_id)->first();
        if (!$m_shop) {
            return false;
        }

        $image_paths = [];

        try {
            foreach ($sizes as $size) {
                if ($type === 'item') {
                    array_merge($image_paths, $m_shop->mItems()->get()->pluck($size . '_image_folder_path')->toArray());
                } elseif ($type === 'menu') {
                    array_merge($image_paths, $m_shop->mMenus()->get()->pluck($size . '_image_folder_path')->toArray());
                } elseif ($type === 'course_menu') {
                    array_merge($image_paths, $m_shop->mCourses()->get()->pluck($size . '_image_folder_path')->toArray());
                }
            }
            unset($size);
        } catch (Exception $e) {
            return false;
        }

        $i = 0;
        $image_ids = [];
        foreach ($sizes as $size) {
            while (true) {
                $image_id = substr(hash('sha256', uniqid($id, true)), 5);

                if (preg_grep("/" . $image_id . "/", $image_paths)) {
                    continue;
                } else {
                    $image_paths[] = $image_id;
                    $image_ids[$size] = $image_id;
                    break;
                }
            }
        }

        return $image_ids;
    }

    /**
     * @param string $shop_id
     * @param array $image_size_paths
     * @return array
     */
    public function s3UploadImages(string $shop_id, array $image_size_paths): array
    {
        $paths = [];
        foreach ($image_size_paths as $key => $value) {
            $paths[] = \Storage::disk('s3')->putFileAs('img/' . $shop_id, $value['local_path'], $value['image_id']);
        }

        return $paths;
    }

    public function updateImagePaths(string $shop_id, string $id, array $paths, string $type)
    {
        return $this->shopRepository->updateImagePaths($shop_id, $id, $paths, $type);
    }
}
