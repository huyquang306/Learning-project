<?php

namespace App\Services;

use GuzzleHttp\Exception\GuzzleException;

class AddressService
{
    /**
     * @throws GuzzleException
     */
    public static function getAddressByGoogleMaps($address)
    {
        $apiKey = env('MIX_GOOGLE_MAP_APIKEY');
        $base_url = config('const.GOOGLE_MAPS_API_ENDPOINT');
        $client = new \GuzzleHttp\Client(
            [
                'base_uri' => $base_url,
            ]
        );

        $path = "api/geocode/json?address=" . urlencode($address) . "+CA&key=" . $apiKey ;
        $response = $client->request(
            'GET',
            $path,
            [
                'allow_redirects' => true,
            ]
        );

        return json_decode((string)$response->getBody())->results;
    }
}