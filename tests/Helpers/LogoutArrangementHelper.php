<?php

namespace Tests\Helpers;

trait LogoutArrangementHelper
{
	protected function logoutFixArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$sessionService = $this->stubSessionServiceLogoutOwnSessions();
		$clientDataContainer = $this->stubClientDataContainerLogoutService($logoutService);
		$this->stubClientDataContainerSessionService($sessionService);

		return [
			'responseFormatterService' => $responseFormatterService,
			'logoutService' => $logoutService,
			'sessionService' => $sessionService,
			'clientDataContainer' => $clientDataContainer,
		];
	}

	protected function logoutDefaultArrangement()
	{
		$clientID = '123';
		$this->authLoginUser($clientID);

		return $this->logoutFixArrangement();
	}

	protected function logoutClientChangeArrangement()
	{
		$clientID = '234';
		$this->authLoginUser($clientID);

		return $this->logoutFixArrangement();
	}
}
