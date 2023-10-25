<?php

namespace App\Http\Containers;

use App\Http\Services\ZirconApiService;
use App\Http\Services\SessionService;
use App\Helpers\UserAgentHelper;

class ClientOtherSourceContainer
{
	private $zirconApiService;
	private $sessionService;
	private $userAgentHelper;

	public function __construct(
		ZirconApiService $zirconApiService,
		SessionService $sessionService,
		UserAgentHelper $userAgentHelper
	) {
		$this->zirconApiService = $zirconApiService;
		$this->sessionService = $sessionService;
		$this->userAgentHelper = $userAgentHelper;
	}

	public function zirconApiService()
	{
		return $this->zirconApiService;
	}

	public function sessionService()
	{
		return $this->sessionService;
	}

	public function userAgentHelper()
	{
		return $this->userAgentHelper;
	}
}
