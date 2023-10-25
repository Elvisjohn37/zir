<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\FrontendService;

trait FrontendServiceMock
{
	private $frontendService;

	protected function mockFrontendService()
	{
		if ($this->frontendService === null) {
			$this->frontendService = $this->createMock(FrontendService::class);
		}

		return $this->frontendService;
	}

	protected function stubFrontendServiceGetRsoUrl()
	{
		$this->mockFrontendService()
			->method('getRsoUrl')
			->willReturn('www.rso-url.com');

		return $this->frontendService;
	}
}
