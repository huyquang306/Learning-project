<?php

namespace App\Http\Resources\Shop;

use App\Http\Resources\BaseResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class HistorySummaryOrderGroupResource extends BaseResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $result = parent::toArray($this);

        return [
            'pagination' => $result['pagination'],
            'data' => SummaryOrderGroupResource::collection($this),
        ];
    }
}
