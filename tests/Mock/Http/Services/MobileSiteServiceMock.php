<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\MobileSiteService;

trait MobileSiteServiceMock
{
	private $mobileSiteService;

	private $mobileSiteServiceReturnValues = [
		'isMobileSite' => false,
	];

	protected function mockMobileSiteService()
	{
		if ($this->mobileSiteService === null) {
			$this->mobileSiteService = $this->createMock(MobileSiteService::class);
		}

		return $this->mobileSiteService;
	}

	public function setMobileSiteServiceReturnValues($returnValues)
	{
		$this->mobileSiteServiceReturnValues = array_replace($this->mobileSiteServiceReturnValues, $returnValues);
	}

	public function stubMobileSiteServiceIsMobileSite($returnValue = null)
	{
		if ($returnValue != null) {
			$this->mobileSiteServiceReturnValues['isMobileSite'] = $returnValue;
		}

		$this->mockMobileSiteService()
			->method('isMobileSite')
			->will(
				$this->returnCallback(function () {
					return $this->mobileSiteServiceReturnValues['isMobileSite'];
				})
			);

		return $this->mobileSiteService;
	}
}
