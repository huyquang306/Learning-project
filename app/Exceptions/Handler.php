<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Exceptions\HttpResponseException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Report or log an exception.
     *
     * @param Throwable $e
     * @return void
     * @throws Throwable
     */
    public function report(Throwable $e)
    {
        parent::report($e);
    }


    /**
     * Render an exception into an HTTP response.
     *
     * @param $request
     * @param Throwable $exception
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request, Throwable $exception): \Illuminate\Http\JsonResponse
    {
        Log::critical($exception);

        if ($exception instanceof AuthenticationException) {
            $statusCode = 401;
            $errorCode = 'unauthorized';

            return $this->responseErrors($statusCode, $errorCode);
        }

        if ($exception instanceof AuthorizationException) {
            $statusCode = 403;
            $errorCode = 'not_permission_access';

            return $this->responseErrors($statusCode, $errorCode);
        }

        if ($exception instanceof ModelNotFoundException
            || $exception instanceof NotFoundHttpException) {
            $statusCode = 404;
            $errorCode = 'not_found';

            return $this->responseErrors($statusCode, $errorCode);
        }

        if ($exception instanceof HttpResponseException) {
            $response = $exception->getResponse();
            if ($response) {
                $content = $response->getContent();
                $statusCode = $response->getStatusCode();
                if ($statusCode === 400) {
                    $content = json_decode($content);
                    $errorCode = $content->data->errorCode;

                    return $this->responseErrors($statusCode, $errorCode);
                }
            }
        }

        $statusCode = 500;
        $errorCode = 'internal_server_error';

        return $this->responseErrors($statusCode, $errorCode);
    }

    /**
     * Return response error
     *
     * @param int $statusCode
     * @param string $errorCode
     * @param string $fieldName
     * @return \Illuminate\Http\JsonResponse
     */
    private function responseErrors(int $statusCode, string $errorCode, string $fieldName = ''): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status' => 'failed',
            'message' => config('const.httpStatusCode.' . $statusCode . '.message'),
            'data' => [
                'field' => $fieldName,
                'errorCode' => $errorCode,
                'errorMessage' => config('const.errorCode.' . $errorCode),
            ],
        ], $statusCode);
    }
}
