<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\GameLobbyService;

trait GameLobbyServiceMock
{
	private $gameLobbyService;

	protected function mockGameLobbyService()
	{
		if ($this->gameLobbyService === null) {
			$this->gameLobbyService = $this->createMock(GameLobbyService::class);
		}

		return $this->gameLobbyService;
	}

	protected function stubGameLobbyServiceGetGame()
	{
		$this->mockGameLobbyService()
			->method('getGame')
			->will(
				$this->returnCallback(function ($request, $user) {
					return [
						'result' => true,
						'data' => [
							'request' => $request->all(),
							'user' => (array) $user,
						],
					];
				})
			);

		return $this->gameLobbyService;
	}

	protected function stubGameLobbyServiceGetRecentGame()
	{
		$this->mockGameLobbyService()
			->method('getRecentGame')
			->will(
				$this->returnCallback(function ($options, $user) {
					return [
						'result' => true,
						'data' => [
							'options' => $options,
							'user' => (array) $user,
						],
					];
				})
			);

		return $this->gameLobbyService;
	}

	public function gameLobbyServiceGetGameWindowDetailsDataGame($requestGameID)
	{
		$sampleGameData = [
			'123' => [
				'gameName' => 'Sample Game 123',
				'gameID' => '123',
				'gameProviderID' => 'provider123',
				'encryptedGameID' => 'encrypted123',
				'productID' => '1',
				'encryptedProductID' => 'encryptedproduct123',
				'maxpayout' => '1000123',
				'url' => 'www.sampleurl123.com',
			],
			'234' => [
				'gameName' => 'Sample Game 234',
				'gameID' => '234',
				'gameProviderID' => 'provider234',
				'encryptedGameID' => 'encrypted234',
				'productID' => '2',
				'encryptedProductID' => 'encryptedproduct234',
				'maxpayout' => '1000234',
				'url' => 'www.sampleurl234.com',
			],
		];

		return $sampleGameData[$requestGameID];
	}

	public function gameLobbyServiceGetGameWindowDetailsDataClient($clientID)
	{
		$sampleClientData = [
			'123' => [
				'playableBalance' => '1000123',
				'currencyCode' => 'USD',
			],
			'234' => [
				'playableBalance' => '1000234',
				'currencyCode' => 'IDR',
			],
		];

		return $sampleClientData[$clientID];
	}

	public function stubGameLobbyServiceGetGameWindowDetails()
	{
		$this->mockGameLobbyService()
			->method('getGameWindowDetails')
			->will(
				$this->returnCallback(function ($requestGameID, $clientID) {
					return [
						'result' => true,
						'data' => [
							'game' => $this->gameLobbyServiceGetGameWindowDetailsDataGame($requestGameID),
							'client' => $this->gameLobbyServiceGetGameWindowDetailsDataClient($clientID),
						],
					];
				})
			);

		return $this->gameLobbyService;
	}

	public function stubGameLobbyServiceCreateOrUpdateGameSession()
	{
		$this->mockGameLobbyService()
			->method('createOrUpdateGameSession')
			->will(
				$this->returnCallback(function ($options, $gameDetail, $clientID) {
					return [
						'result' => true,
						'data' => [
							'token' => [
								'options' => $options,
								'gameDetail' => $gameDetail,
								'clientID' => $clientID,
							],
						],
					];
				})
			);

		return $this->gameLobbyService;
	}

	public function stubGameLobbyServiceCreateGameUrl()
	{
		$this->mockGameLobbyService()
			->method('createGameUrl')
			->will(
				$this->returnCallback(function ($gameDetail, $clientDetail, $token) {
					return [
						'result' => true,
						'data' => [
							'gameDetail' => $gameDetail,
							'clientDetail' => $clientDetail,
							'token' => $token,
						],
					];
				})
			);

		return $this->gameLobbyService;
	}
}
