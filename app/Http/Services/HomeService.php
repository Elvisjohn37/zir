<?php

namespace App\Http\Services;

use App\Http\Containers\GameLobbyRepositoryContainer;
use Config;

class HomeService
{
	private $gameRepository;

	function __construct(
		GameLobbyRepositoryContainer $gameLobbyRepositoryContainer,
	) {
		$this->gameRepository = $gameLobbyRepositoryContainer->gameRepository;
	}

	private function success($data = 'success')
	{
		return ['result' => true, 'data' => $data];
	}

	private function error($data)
	{
		return ['result' => false, 'data' => $data];
	}

    public function getPageProductIDs($page)
	{
		return explode(',', Config::get('custom.games.productIDs')[$page]);
	}

	public function getBsiGames($request)
	{
		$page = $request->page;
		$bsiNewGames = $this->gameRepository->getBsiNewGames($this->getPageProductIDs($page));
		$bsiTopGames = $this->gameRepository->getBsiTopGames($this->getPageProductIDs($page));
		if (empty($bsiNewGames) && empty($bsiTopGames)) {
			return $this->error('GameNotFound');
		} else {
			return $this->success([
				'newGames' => $bsiNewGames,
				'topGames' => $bsiTopGames,
			]);
		}
	}
}
