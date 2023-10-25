<?php

namespace Tests\Mock\Http\Repositories;

use App\Http\Repositories\GameRepository;

trait GameRepositoryMock
{
	private $gameRepository;

	protected function mockGameRepository()
	{
		if ($this->gameRepository === null) {
			$this->gameRepository = $this->createMock(GameRepository::class);
		}

		return $this->gameRepository;
	}

	protected function stubGameRepositoryGetGame()
	{
		$this->mockGameRepository()
			->method('getGame')
			->will(
				$this->returnCallback(function ($arg1) {
					return ['list' => $arg1];
				})
			);

		return $this->gameRepository;
	}

	protected function stubGameRepositoryGetRecentGame()
	{
		$this->mockGameRepository()
			->method('getRecentGame')
			->will(
				$this->returnCallback(function ($page, $clientID, $isMobileDevice) {
					return $page . $clientID . $isMobileDevice;
				})
			);

		return $this->gameRepository;
	}

	protected function stubGameRepositoryGetGameGuideList()
	{
		$this->mockGameRepository()
			->method('getGameGuideList')
			->willReturnArgument(0);

		return $this->gameRepository;
	}
}
