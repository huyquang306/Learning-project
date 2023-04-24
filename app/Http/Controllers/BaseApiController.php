<?php

namespace App\Http\Controllers;

abstract class BaseApiController extends Controller
{
    /**
     * BaseAPIController constructor.
     */
    public function __construct()
    {
    }

    /**
     * @param $result
     * @param int $statusCode
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function responseApi($result, int $statusCode = 200, string $message = ''): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status' => ($statusCode == 200) ? 'success' : 'failure',
            'message' => $message ?? config('const.httpStatusCode.' . $statusCode . '.message'),
            'result' => $result ?? [],
        ], $statusCode);
    }
}