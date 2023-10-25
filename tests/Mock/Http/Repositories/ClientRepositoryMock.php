<?php

namespace Tests\Mock\Http\Repositories;

use App\Http\Repositories\ClientRepository;
use DateTime;

trait ClientRepositoryMock
{
	private $clientRepository;

	private $clientRepositoryReturnValues = [
		'getAccountBalance' => null,
		'isAllowedLogin' => true,
	];

	protected function mockClientRepository()
	{
		if ($this->clientRepository === null) {
			$this->clientRepository = $this->createMock(ClientRepository::class);
		}

		return $this->clientRepository;
	}

	public function setClientRepositoryReturn($returnValues)
	{
		$this->clientRepositoryReturnValues = array_replace($this->clientRepositoryReturnValues, $returnValues);
	}

	public function stubClientRepositoryGetAccountBalance($returnValue = null)
	{
		if ($returnValue) {
			$this->clientRepositoryReturnValues['getAccountBalance'] = $returnValue;
		}

		$this->mockClientRepository()
			->method('getAccountBalance')
			->will(
				$this->returnCallback(function ($clientID) {
					return $this->clientRepositoryReturnValues['getAccountBalance'] == null
						? null
						: $clientID . $this->clientRepositoryReturnValues['getAccountBalance'];
				})
			);
		return $this->clientRepository;
	}

	public function stubClientRepositoryIsAllowedLogin($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->clientRepositoryReturnValues['isAllowedLogin'] = $returnValue;
		}

		$this->mockClientRepository()
			->method('isAllowedLogin')
			->will(
				$this->returnCallback(function () {
					return $this->clientRepositoryReturnValues['isAllowedLogin'];
				})
			);
		return $this->clientRepository;
	}

	public function stubClientRepositoryCreateSession()
	{
		$this->mockClientRepository()
			->method('createSession')
			->will(
				$this->returnCallback(function ($clientID, $ip) {
					return [
						'clientID' => $clientID,
						'ip' => $ip,
					];
				})
			);
		return $this->clientRepository;
	}

	public function stubClientRepositoryCreateLoginLog()
	{
		$this->mockClientRepository()
			->method('createLoginLog')
			->will(
				$this->returnCallback(function ($username, $ip) {
					return [
						'username' => $username,
						'ip' => $ip,
					];
				})
			);
		return $this->clientRepository;
	}

	public function stubClientRepositoryGetClientLoginDetails()
	{
		$this->mockClientRepository()
			->method('getClientLoginDetails')
			->willReturnArgument(0);

		return $this->clientRepository;
	}

	public function stubClientRepositoryGetInactiveClientID()
	{
		$this->mockClientRepository()
			->method('getInactiveClientID')
			->will(
				$this->returnCallback(function ($loginClientIDs, $inActiveTime) {
					$newDate = date(
						'Y-m-d H:i:s',
						strtotime('-' . $inActiveTime . ' minutes', strtotime('2022-09-22 01:00:00'))
					);
					return array_filter($loginClientIDs, function ($item) use ($newDate) {
						return new DateTime($item['timeStampActivity']) <= new DateTime($newDate);
					});
				})
			);

		return $this->clientRepository;
	}
}
