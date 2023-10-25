<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\ResponseFormatterService;

trait ResponseFormatterServiceMock
{
	private $responseFormatterService;

	protected function mockResponseFormatterService()
	{
		if ($this->responseFormatterService === null) {
			$this->responseFormatterService = $this->createMock(ResponseFormatterService::class);
		}

		return $this->responseFormatterService;
	}

	protected function stubResponseFormatterServiceSuccess()
	{
		$this->mockResponseFormatterService()
			->method('success')
			->willReturnArgument(0);

		return $this->responseFormatterService;
	}

	protected function stubResponseFormatterServiceJson()
	{
		$this->mockResponseFormatterService()
			->method('json')
			->will(
				$this->returnCallback(function ($response, $status) {
					return ['response' => $response, 'status' => $status];
				})
			);

		return $this->responseFormatterService;
	}
}
