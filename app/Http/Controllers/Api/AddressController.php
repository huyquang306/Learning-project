<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseApiController;
use App\Services\AddressService;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;

class AddressController extends BaseApiController
{
    protected $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    /**
     * @throws GuzzleException
     */
    public function getGeoCode(string $address): array
    {
        try {
            $response = $this->addressService->getAddressByGooglemaps($address);

            if ($response) {
                $status = 'success';
                $message = '';
                $result = [
                    "lat" => $response[0]->geometry->location->lat,
                    "lng" => $response[0]->geometry->location->lng
                ];
            }

            if (!$response) {
                $status  = 'failure';
                $message = 'invalid_param';
                $result  = [
                    "fields" => "address",
                    "errorCode" => "invalid_param",
                ];
            }

            return [
                'status' => $status,
                'message' => $message,
                'result' => $result,
            ];
        } catch (\Exception $exception) {
            return [
                'status' => 'failure',
                'message' => $exception->getMessage(),
                'result' => '',
            ];
        }
    }
}
