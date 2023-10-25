<?php

namespace App\Http\Containers;

use App\Http\Containers\ClientDbContainer;
use App\Http\Containers\ClientOtherSourceContainer;
use App\Http\Services\LogoutService;

class ClientDataContainer
{
	private $clientDbContainer;
	private $clientOtherSourceContainer;
	private $logoutService;

	public function __construct(
		ClientDbContainer $clientDbContainer,
		ClientOtherSourceContainer $clientOtherSourceContainer,
		LogoutService $logoutService
	) {
		$this->clientDbContainer = $clientDbContainer;
		$this->clientOtherSourceContainer = $clientOtherSourceContainer;
		$this->logoutService = $logoutService;
	}

	public function clientRepository()
	{
		return $this->clientDbContainer->clientRepository();
	}

	public function gameRepository()
	{
		return $this->clientDbContainer->gameRepository();
	}

	public function zirconApiService()
	{
		return $this->clientOtherSourceContainer->zirconApiService();
	}

	public function sessionService()
	{
		return $this->clientOtherSourceContainer->sessionService();
	}

	public function userAgentHelper()
	{
		return $this->clientOtherSourceContainer->userAgentHelper();
	}

	public function clientIpBlackList()
	{
		return $this->clientDbContainer
			->clientRepository()
			->ipBlacklist($this->clientOtherSourceContainer->userAgentHelper()->getIp());
	}

	public function logoutService()
	{
		return $this->logoutService;
	}
}
