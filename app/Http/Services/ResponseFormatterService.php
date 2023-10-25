<?php

namespace App\Http\Services;

use Throwable;
use Response;
use Request;
use Config;

class ResponseFormatterService
{
	private function addDefaultPageDetail($response)
	{
		if (!isset($response['data']['title'])) {
			$response['data']['title'] = $response['result']
				? Config::get('custom.site.defaultTitle')
				: Config::get('custom.site.defaultTitleError');
		}

		return $response['data'];
	}

	private function defaultErrorFormatter($error, $statusCode, Throwable $exception)
	{
		$response = [
			'result' => false,
			'status' => $statusCode,
			'error' => $error,
			'requestID' => request()->requestID,
		];

		if (method_exists($exception, 'addResponse')) {
			$response = array_merge($response, $exception->addResponse());
		}

		$responseStatusCode =
			Config::get('custom.response.errorStatusCode') === false
				? $statusCode
				: Config::get('custom.response.errorStatusCode');

		if (Request::wantsJson()) {
			return Response::json($response, $responseStatusCode);
		} else {
			$response['data'] = $this->addDefaultPageDetail($response);
			return Response::view('withresponse', ['response' => $response])->setStatusCode($responseStatusCode);
		}
	}

	public function error(Throwable $exception)
	{
		$errorCode = isset($exception->errorCode) ? $exception->errorCode : 'ERR_00001';
		$statusCode = method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : '500';

		return $this->defaultErrorFormatter(['code' => $errorCode], $statusCode, $exception);
	}

	private function defaultSuccessFormatter($data)
	{
		$response = ['result' => true, 'data' => $data];
		if (Request::wantsJson()) {
			return Response::json($response);
		} else {
			$response['data'] = $this->addDefaultPageDetail($response);
			return Response::view('withresponse', ['response' => $response]);
		}
	}

	public function success($data)
	{
		return $this->defaultSuccessFormatter($data);
	}

	public function json($data, $status)
	{
		return Response::json($data, $status);
	}
}
