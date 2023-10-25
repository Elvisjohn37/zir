<?php

namespace App\Http\Controllers;

use App\Http\Services\SboWindowService;
use Redirect;
use Auth;
use App\Exceptions\UnauthorizedException;

class SboWindowController extends BaseController
{
	private $sboWindowService;

	public function __construct(SboWindowService $sboWindowService)
	{
		$this->sboWindowService = $sboWindowService;
	}

	public function sportsWindow()
	{
		return Redirect::to($this->sboWindowService->sports());
	}

	public function balanceWindow()
	{
		return Redirect::to($this->sboWindowService->balance());
	}

	public function limitAdjustWindow()
	{
		return Redirect::to($this->sboWindowService->limitAdjust());
	}

	public function selfExclusionWindow()
	{
		return Redirect::to($this->sboWindowService->selfExclusion());
	}

	public function transferFundsWindow()
	{
		if (Auth::user()->isWalkIn != 1) {
			throw new UnauthorizedException('Only walkin players could proceed to transfer fund window');
		}

		return Redirect::to($this->sboWindowService->transferFunds());
	}
}
