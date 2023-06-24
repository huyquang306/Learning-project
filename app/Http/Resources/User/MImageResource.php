<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class MImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            's_image_path' => $this->s_image_path,
            'm_image_path' => $this->m_image_path,
            'l_image_path' => $this->l_image_path,
            'image_path' => $this->image_path,
        ];
    }
}
