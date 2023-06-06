<?php

namespace App\Http\Resources\Shop;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $rShopCourse = null;
        $mCoursePrices = null;
        if ($this->relationLoaded('rShopCourse')) {
            $rShopCourse = $this->rShopCourse;
        }
        if ($rShopCourse && $rShopCourse->relationLoaded('mCoursePrices')) {
            $mCoursePrices = $rShopCourse->mCoursePrices;
        }

        return [
            'hash_id' => $this->hash_id,
            'name' => $this->name,
            'time_block_unit' => $this->time_block_unit,
            's_image_folder_path' => $this->s_image_folder_path,
            'm_image_folder_path' => $this->m_image_folder_path,
            'l_image_folder_path' => $this->l_image_folder_path,
            'image_file_name' => $this->image_file_name,
            'status' => $rShopCourse ? $rShopCourse->status : null,
            'alert_notification_time' => $this->alert_notification_time,
            'list_course_prices' => $mCoursePrices ? CoursePriceResource::collection($mCoursePrices) : [],
            'list_child_courses' => CourseResource::collection($this->whenLoaded('childCourses')),
            'list_menus' => MenuByCourseResource::collection($this->whenLoaded('mMenus')),
            'initial_propose_flg' => $this->initial_propose_flg,
            'shop_alert_flg' => $this->shop_alert_flg,
            'user_alert_flg' => $this->user_alert_flg,
            'shop_end_time_alert_flg' => $this->shop_end_time_alert_flg,
            'user_end_time_alert_flg' => $this->user_end_time_alert_flg,
        ];
    }
}
