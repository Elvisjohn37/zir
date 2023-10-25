<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use App\Http\Controllers\SboWindowController;
use Tests\Mock\Http\Services\SboWindowServiceMock;
use Tests\Mock\Laravel\RedirectMock;
use Tests\Mock\Laravel\AuthMock;
use App\Exceptions\UnauthorizedException;

class SboWindowControllerTest extends TestCase
{
	use SboWindowServiceMock, RedirectMock, AuthMock;

	private function createController($sboWindowService = null)
	{
		$sboWindowService = $sboWindowService !== null ? $sboWindowService : $this->mockSboWindowService();

		return new SboWindowController($sboWindowService);
	}

	public function testSportsWindowShouldRedirectToSboReports()
	{
		$this->stubRedirectTo();
		$sboWindowService = $this->stubSboWindowServiceSports();

		$sboWindowController = $this->createController($sboWindowService);
		$sportsWindow = $sboWindowController->sportsWindow();

		$this->assertEquals('redirecttowww.sports.com', $sportsWindow);
	}

	public function testBalanceWindowShouldRedirectToSboBalanceWindow()
	{
		$this->stubRedirectTo();
		$sboWindowService = $this->stubSboWindowServiceBalance();

		$sboWindowController = $this->createController($sboWindowService);
		$sportsWindow = $sboWindowController->balanceWindow();

		$this->assertEquals('redirecttowww.balance.com', $sportsWindow);
	}

	public function testLimitAdjustWindowShouldRedirectToSboLimitAdjustWindow()
	{
		$this->stubRedirectTo();
		$sboWindowService = $this->stubSboWindowServiceLimitAdjust();

		$sboWindowController = $this->createController($sboWindowService);
		$sportsWindow = $sboWindowController->limitAdjustWindow();

		$this->assertEquals('redirecttowww.limitAdjust.com', $sportsWindow);
	}

	public function testSelfExclusionWindowShouldRedirectToSboSelfExclusionWindow()
	{
		$this->stubRedirectTo();
		$sboWindowService = $this->stubSboWindowServiceSelfExclusion();

		$sboWindowController = $this->createController($sboWindowService);
		$sportsWindow = $sboWindowController->selfExclusionWindow();

		$this->assertEquals('redirecttowww.selfExclusion.com', $sportsWindow);
	}

	public function testTransferFundsWindowShouldRedirectToSboTransferFundsWindow()
	{
		$this->stubRedirectTo();
		$this->stubAuthUser(['isWalkIn' => 1]);
		$sboWindowService = $this->stubSboWindowServiceTransferFunds();

		$sboWindowController = $this->createController($sboWindowService);
		$sportsWindow = $sboWindowController->transferFundsWindow();

		$this->assertEquals('redirecttowww.transferFunds.com', $sportsWindow);
	}

	public function testTransferFundsWindowShouldNotRedirectToSboTransferFundsWindowWhenPlayerIsNotWalkin()
	{
		$this->stubRedirectTo();
		$this->stubAuthUser(['isWalkIn' => 0]);
		$sboWindowService = $this->stubSboWindowServiceTransferFunds();

		$this->expectException(UnauthorizedException::class);

		$sboWindowController = $this->createController($sboWindowService);
		$sboWindowController->transferFundsWindow();
	}
}
