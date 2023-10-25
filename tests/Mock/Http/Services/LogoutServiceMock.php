<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\LogoutService;

trait LogoutServiceMock
{
	private $logoutService;

	private $logoutServiceReturnValues = [
		'logoutClientData' => null,
	];

	protected function mockLogoutService()
	{
		if ($this->logoutService === null) {
			$this->logoutService = $this->createMock(LogoutService::class);
		}

		return $this->logoutService;
	}

	public function setLogoutServiceReturnValues($returnValues)
	{
		$this->logoutServiceReturnValues = array_replace($this->logoutServiceReturnValues, $returnValues);
	}

	public function stubLogoutServiceLogoutClientData($returnValue = null)
	{
		if ($returnValue != null) {
			$this->logoutServiceReturnValues['logoutClientData'] = $returnValue;
		}

		$this->mockLogoutService()
			->method('logoutClientData')
			->will(
				$this->returnCallback(function ($clientIDs, $sessionHandler, $isLogoutThirdParty) {
					$clientIDs = is_array($clientIDs) ? $clientIDs : [$clientIDs];

					if (is_callable($sessionHandler)) {
						$sessionHandler();
					}

					return $this->logoutServiceReturnValues['logoutClientData'] == null
						? count($clientIDs)
						: $this->logoutServiceReturnValues['logoutClientData'];
				})
			);

		return $this->logoutService;
	}
}
