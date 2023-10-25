<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\ZirconApiService;

trait ZirconApiServiceMock
{
	private $zirconApiService;

	private $defaultLoginDetails = [
		'123' => [
			'clientID' => '123',
			'language' => 'en',
			'sessionID' => '123session',
		],
		'234' => [
			'clientID' => '234',
			'language' => 'th',
			'sessionID' => '234session',
		],
	];

	private $zirconApiServiceReturnValues = [
		'getMobileLoginDetail' => null,
		'getLoginDetail' => null,
	];

	protected function setZirconApiServiceReturn($returnValues)
	{
		$this->zirconApiServiceReturnValues = array_replace($this->zirconApiServiceReturnValues, $returnValues);
	}

	protected function mockZirconApiService()
	{
		if ($this->zirconApiService === null) {
			$this->zirconApiService = $this->createMock(ZirconApiService::class);
		}

		return $this->zirconApiService;
	}

	public function ziconApiServiceGetLoginDetail($id)
	{
		return isset($this->defaultLoginDetails[$id]) ? $this->defaultLoginDetails[$id] : null;
	}

	public function stubZirconApiServiceGetLoginDetail()
	{
		$this->mockZirconApiService()
			->method('getLoginDetail')
			->will(
				$this->returnCallback(function ($token) {
					return $this->zirconApiServiceReturnValues['getLoginDetail'] == null
						? $this->ziconApiServiceGetLoginDetail($token)
						: $this->zirconApiServiceReturnValues['getLoginDetail'];
				})
			);

		return $this->zirconApiService;
	}

	public function stubZirconApiServiceGetMobileLoginDetail()
	{
		$this->mockZirconApiService()
			->method('getMobileLoginDetail')
			->will(
				$this->returnCallback(function ($id) {
					return $this->zirconApiServiceReturnValues['getMobileLoginDetail'] == null
						? $this->ziconApiServiceGetLoginDetail($id)
						: $this->zirconApiServiceReturnValues['getMobileLoginDetail'];
				})
			);

		return $this->zirconApiService;
	}

	public function stubZirconApiServiceEyeconBetDetails()
	{
		$this->mockZirconApiService()
			->method('eyeconBetDetails')
			->will(
				$this->returnCallback(function ($payload) {
					return 'www.eyecon-' . $payload . '.com';
				})
			);

		return $this->zirconApiService;
	}

	public function stubZirconApiServiceFunkyBetDetails()
	{
		$this->mockZirconApiService()
			->method('funkyBetDetails')
			->will(
				$this->returnCallback(function ($payload) {
					return 'www.funky-' . $payload . '.com';
				})
			);

		return $this->zirconApiService;
	}

	public function stubZirconApiServiceSettleRunningGame()
	{
		$this->mockZirconApiService()
			->method('settleRunningGame')
			->willReturnArgument(0);

		return $this->zirconApiService;
	}
}
