<?php

namespace App\Http\Containers;

use App\Http\Repositories\GameRepository;
use App\Http\Repositories\ClientRepository;
use App\Http\Repositories\ReferenceRepository;

class GameLobbyRepositoryContainer
{
	public $gameRepository;
	public $clientRepository;
	public $referenceRepository;

	public function __construct(GameRepository $gameRepository,ClientRepository $clientRepository,ReferenceRepository $referenceRepository)
	{
		$this->gameRepository = $gameRepository;
		$this->clientRepository = $clientRepository;
		$this->referenceRepository = $referenceRepository;
	}
}
