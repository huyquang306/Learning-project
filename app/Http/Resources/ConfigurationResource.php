<?php

namespace App\Http\Resources;

use App\Models\SConfiguration;
use Illuminate\Http\Resources\Json\JsonResource;

class ConfigurationResource extends JsonResource
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
            SConfiguration::ROBOT_REGISTER_KEY => $this->{SConfiguration::ROBOT_REGISTER_KEY},
        ];
    }
}
