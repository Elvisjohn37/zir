<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\SessionService;

trait SessionServiceMock
{
	private $sessionService;

	private $loginClients = [
		['clientID' => 123, 'timeStampActivity' => '2022-09-22 00:00:00'],
		['clientID' => 234, 'timeStampActivity' => '2022-09-22 00:25:00'],
		['clientID' => 345, 'timeStampActivity' => '2022-09-22 00:30:00'],
		['clientID' => 456, 'timeStampActivity' => '2022-09-22 00:31:00'],
	];

	private $sessionServiceReturnValues = [
		'isClientLogin' => null,
		'logoutOwnSessions' => true,
		'getAllLoginClientID' => null,
		'logoutAllSessions' => true,
	];

	protected function mockSessionService()
	{
		if ($this->sessionService === null) {
			$this->sessionService = $this->createMock(SessionService::class);
		}

		return $this->sessionService;
	}

	public function setSessionServiceReturnValues($returnValues)
	{
		$this->sessionServiceReturnValues = array_replace($this->sessionServiceReturnValues, $returnValues);
	}

	public function stubSessionServiceIsClientLogin($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sessionServiceReturnValues['isClientLogin'] = $returnValue;
		}

		$this->mockSessionService()
			->method('isClientLogin')
			->will(
				$this->returnCallback(function ($clientID) {
					return $this->sessionServiceReturnValues['isClientLogin'] === null
						? count(
								array_filter($this->loginClients, function ($client) use ($clientID) {
									return $client['clientID'] == $clientID;
								})
							) > 0
						: $this->sessionServiceReturnValues['isClientLogin'];
				})
			);

		return $this->sessionService;
	}

	public function stubSessionServiceLogoutOwnSessions($returnValue = null)
	{
		if ($returnValue != null) {
			$this->sessionServiceReturnValues['logoutOwnSessions'] = $returnValue;
		}

		$this->mockSessionService()
			->method('logoutOwnSessions')
			->will(
				$this->returnCallback(function () {
					return $this->sessionServiceReturnValues['logoutOwnSessions'];
				})
			);

		return $this->sessionService;
	}

	public function stubSessionServiceGetAllLoginClientID($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sessionServiceReturnValues['getAllLoginClientID'] = $returnValue;
		}

		$this->mockSessionService()
			->method('getAllLoginClientID')
			->will(
				$this->returnCallback(function () {
					return $this->sessionServiceReturnValues['getAllLoginClientID'] === null
						? $this->loginClients
						: $this->sessionServiceReturnValues['getAllLoginClientID'];
				})
			);

		return $this->sessionService;
	}

	public function stubSessionServiceLogoutAllSessions($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sessionServiceReturnValues['logoutAllSessions'] = $returnValue;
		}

		$this->mockSessionService()
			->method('logoutAllSessions')
			->will(
				$this->returnCallback(function () {
					return $this->sessionServiceReturnValues['logoutAllSessions'];
				})
			);

		return $this->sessionService;
	}
}
