<?php

namespace App\Http\Containers;

use App\Http\Repositories\ClientRepository;
use App\Http\Repositories\GameRepository;

class ClientDbContainer
{
	private $clientRepository;
	private $gameRepository;

	public function __construct(ClientRepository $clientRepository, GameRepository $gameRepository)
	{
		$this->clientRepository = $clientRepository;
		$this->gameRepository = $gameRepository;
	}

	public function clientRepository()
	{
		return $this->clientRepository;
	}

	public function gameRepository()
	{
		return $this->gameRepository;
	}
}
