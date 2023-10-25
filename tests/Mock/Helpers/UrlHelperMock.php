<?php

namespace Tests\Mock\Helpers;

use App\Helpers\UrlHelper;

trait UrlHelperMock
{
	private $arrayHelper;

	protected function mockUrlHelper()
	{
		if ($this->arrayHelper === null) {
			$this->arrayHelper = $this->createMock(UrlHelper::class);
		}

		return $this->arrayHelper;
	}

	protected function stubUrlHelperReplaceDomain()
	{
		$this->mockUrlHelper()
			->method('replaceDomain')
			->will(
				$this->returnCallback(function ($toReplace, $newHost, $token = 'DOMAIN') {
					return 'replace' . $toReplace . 'new' . $newHost . 'token' . $token;
				})
			);

		return $this->arrayHelper;
	}
}
