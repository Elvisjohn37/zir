<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\SboWindowService;

trait SboWindowServiceMock
{
	private $sboWindowService;
	private $sboWindowServiceReturnValues = [
		'sports' => 'www.sports.com',
		'balance' => 'www.balance.com',
		'limitAdjust' => 'www.limitAdjust.com',
		'selfExclusion' => 'www.selfExclusion.com',
		'transferFunds' => 'www.transferFunds.com',
	];

	protected function mockSboWindowService()
	{
		if ($this->sboWindowService === null) {
			$this->sboWindowService = $this->createMock(SboWindowService::class);
		}

		return $this->sboWindowService;
	}

	protected function stubSboWindowServiceSports($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sboWindowServiceReturnValues['sports'] = $returnValue;
		}

		$this->mockSboWindowService()
			->method('sports')
			->will(
				$this->returnCallback(function () {
					return $this->sboWindowServiceReturnValues['sports'];
				})
			);

		return $this->sboWindowService;
	}

	protected function stubSboWindowServiceBalance($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sboWindowServiceReturnValues['balance'] = $returnValue;
		}

		$this->mockSboWindowService()
			->method('balance')
			->will(
				$this->returnCallback(function () {
					return $this->sboWindowServiceReturnValues['balance'];
				})
			);

		return $this->sboWindowService;
	}

	protected function stubSboWindowServiceLimitAdjust($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sboWindowServiceReturnValues['limitAdjust'] = $returnValue;
		}

		$this->mockSboWindowService()
			->method('limitAdjust')
			->will(
				$this->returnCallback(function () {
					return $this->sboWindowServiceReturnValues['limitAdjust'];
				})
			);

		return $this->sboWindowService;
	}

	protected function stubSboWindowServiceSelfExclusion($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sboWindowServiceReturnValues['selfExclusion'] = $returnValue;
		}

		$this->mockSboWindowService()
			->method('selfExclusion')
			->will(
				$this->returnCallback(function () {
					return $this->sboWindowServiceReturnValues['selfExclusion'];
				})
			);

		return $this->sboWindowService;
	}

	protected function stubSboWindowServiceTransferFunds($returnValue = null)
	{
		if ($returnValue !== null) {
			$this->sboWindowServiceReturnValues['transferFunds'] = $returnValue;
		}

		$this->mockSboWindowService()
			->method('transferFunds')
			->will(
				$this->returnCallback(function () {
					return $this->sboWindowServiceReturnValues['transferFunds'];
				})
			);

		return $this->sboWindowService;
	}
}
