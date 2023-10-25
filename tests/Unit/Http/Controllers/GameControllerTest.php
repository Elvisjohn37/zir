<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use App\Http\Requests\GetGameReq;
use App\Http\Requests\PlayReq;
use App\Http\Requests\DeleteGameSessionReq;
use App\Http\Requests\CloseGameReq;
use App\Http\Requests\GetGameCategories;
use App\Http\Controllers\GameController;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Services\GameLobbyServiceMock;
use Tests\Mock\Laravel\AuthMock;
use Tests\Mock\Laravel\ConfigMock;
use Tests\Mock\Helpers\ArrayHelperMock;
use App\Exceptions\GameTestModeException;
use Auth;

class GameControllerTest extends TestCase
{
	use ResponseFormatterServiceMock, GameLobbyServiceMock, AuthMock, ConfigMock, ArrayHelperMock;

	private function createController($responseFormatterService = null, $gameLobbyService = null, $utilsHelper = null)
	{
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockresponseFormatterService();

		$gameLobbyService = $gameLobbyService !== null ? $gameLobbyService : $this->mockGameLobbyService();

		$utilsHelper = $utilsHelper !== null ? $utilsHelper : $this->mockArrayHelper();

		return new GameController($responseFormatterService, $gameLobbyService, $utilsHelper);
	}

	private function setGetGamesDefaultConfig()
	{
		$this->stubConfig([
			'custom.games.topLimit' => 20,
			'custom.games.recentLimit' => 20,
		]);
	}

	public function testGetGameShouldGetAllGameLobbyData()
	{
		$this->setGetGamesDefaultConfig();
		$this->stubAuthUserDefault();
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameLobbyService = $this->stubGameLobbyServiceGetGame();
		$this->stubGameLobbyServiceGetRecentGame();

		$gameController = $this->createController($reponseFormatterService, $gameLobbyService);
		$getGame = $gameController->getGame(new GetGameReq(['page' => 'Games', 'isMobileDevice' => 0]));

		$this->assertEquals($getGame, [
			'request' => ['page' => 'Games', 'isMobileDevice' => 0],
			'user' => (array) Auth::user(),
			'topLimit' => 20,
			'recentLimit' => 20,
			'recentGames' => [
				'options' => ['page' => 'Games', 'isMobileDevice' => 0],
				'user' => (array) Auth::user(),
			],
		]);
	}

	public function testGetGameShouldGetCorrectGameLobbyDataWhenPageChanges()
	{
		$this->setGetGamesDefaultConfig();
		$this->stubAuthUserDefault();
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameLobbyService = $this->stubGameLobbyServiceGetGame();
		$this->stubGameLobbyServiceGetRecentGame();
		$page = 'Skill Games';

		$gameController = $this->createController($reponseFormatterService, $gameLobbyService);
		$getGame = $gameController->getGame(new GetGameReq(['page' => $page, 'isMobileDevice' => 0]));

		$this->assertEquals($page, $getGame['request']['page']);
		$this->assertEquals($page, $getGame['recentGames']['options']['page']);
	}

	public function testGetGameShouldGetCorrectGameLobbyDataWhenPlayerChanges()
	{
		$this->setGetGamesDefaultConfig();
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameLobbyService = $this->stubGameLobbyServiceGetGame();
		$this->stubGameLobbyServiceGetRecentGame();
		$user = ['clientID' => '123', 'currencyID' => '1', 'isTestPlayer' => '1'];
		$this->stubAuthUser($user);

		$gameController = $this->createController($reponseFormatterService, $gameLobbyService);
		$getGame = $gameController->getGame(new GetGameReq(['page' => 'Games', 'isMobileDevice' => 0]));

		$this->assertEquals($user, $getGame['user']);
		$this->assertEquals($user, $getGame['recentGames']['user']);
	}

	public function testGetGameShouldGetCorrectGameLobbyDataWhenUsingMobile()
	{
		$this->setGetGamesDefaultConfig();
		$this->stubAuthUserDefault();
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameLobbyService = $this->stubGameLobbyServiceGetGame();
		$this->stubGameLobbyServiceGetRecentGame();

		$gameController = $this->createController($reponseFormatterService, $gameLobbyService);
		$getGame = $gameController->getGame(new GetGameReq(['page' => 'Games', 'isMobileDevice' => 1]));

		$this->assertEquals(1, $getGame['request']['isMobileDevice']);
		$this->assertEquals(1, $getGame['recentGames']['options']['isMobileDevice']);
	}

	public function testGetGameShouldGetCorrectGameLobbyDataWhenConfigChanges()
	{
		$this->stubConfig([
			'custom.games.topLimit' => 30,
			'custom.games.recentLimit' => 30,
		]);
		$this->stubAuthUserDefault();
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameLobbyService = $this->stubGameLobbyServiceGetGame();
		$this->stubGameLobbyServiceGetRecentGame();

		$gameController = $this->createController($reponseFormatterService, $gameLobbyService);
		$getGame = $gameController->getGame(new GetGameReq(['page' => 'Games', 'isMobileDevice' => 0]));

		$this->assertEquals(30, $getGame['topLimit']);
		$this->assertEquals(30, $getGame['recentLimit']);
	}

	public function testGetGameShouldThrowErrorWhenNoGameWasFound()
	{
		$this->setGetGamesDefaultConfig();
		$this->stubAuthUserDefault();

		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameLobbyService = $this->stubGameLobbyServiceGetRecentGame();
		$gameLobbyService->method('getGame')->willReturn(['result' => false]);

		$this->expectException(GameTestModeException::class);

		$gameController = $this->createController($reponseFormatterService, $gameLobbyService);
		$gameController->getGame(new GetGameReq(['page' => 'Games', 'isMobileDevice' => 1]));
	}

	private function playDefaultStubs()
	{
		$this->stubConfig([
			'custom.games.productIDs' => ['Game' => '1', 'Skill Games' => '2'],
		]);
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameLobbyService = $this->stubGameLobbyServiceGetGameWindowDetails();
		$this->stubGameLobbyServiceCreateOrUpdateGameSession();
		$this->stubGameLobbyServiceCreateGameUrl();
		$utilsHelper = $this->stubArrayHelperFindKey();

		return [
			'reponseFormatterService' => $reponseFormatterService,
			'gameLobbyService' => $gameLobbyService,
			'utilsHelper' => $utilsHelper,
		];
	}

	public function testPlayShouldGetGameWindowDetails()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUserDefault();
		$requestGameID = '123';
		$sampleGameData = $this->gameLobbyServiceGetGameWindowDetailsDataGame($requestGameID);
		$sampleClientData = $this->gameLobbyServiceGetGameWindowDetailsDataClient('123');

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);
		$play = $gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 0]));

		$this->assertEquals(
			[
				'url' => [
					'gameDetail' => $sampleGameData,
					'clientDetail' => $sampleClientData,
					'token' => [
						'options' => ['page' => 'Game', 'isMobileDevice' => 0],
						'gameDetail' => $sampleGameData,
						'clientID' => '123',
					],
				],
				'title' => $sampleGameData['gameName'],
				'maxPayout' => $sampleGameData['maxpayout'],
				'isMobile' => 0,
				'viewport' => 'desktop',
				'productID' => $sampleGameData['encryptedProductID'],
				'balanceInfo' => [
					'playableBalance' => $sampleClientData['playableBalance'],
					'currencyCode' => $sampleClientData['currencyCode'],
				],
			],
			$play
		);
	}

	public function testPlayShouldGetCorrectGameWindowDetailsWhenGameChanges()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUserDefault();
		$requestGameID = '234';
		$sampleGameData = $this->gameLobbyServiceGetGameWindowDetailsDataGame($requestGameID);
		$sampleClientData = $this->gameLobbyServiceGetGameWindowDetailsDataClient('123');

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);
		$play = $gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 0]));

		$this->assertEquals(
			[
				'url' => [
					'gameDetail' => $sampleGameData,
					'clientDetail' => $sampleClientData,
					'token' => [
						'options' => ['page' => 'Skill Games', 'isMobileDevice' => 0],
						'gameDetail' => $sampleGameData,
						'clientID' => '123',
					],
				],
				'title' => $sampleGameData['gameName'],
				'maxPayout' => $sampleGameData['maxpayout'],
				'isMobile' => 0,
				'viewport' => 'desktop',
				'productID' => $sampleGameData['encryptedProductID'],
				'balanceInfo' => [
					'playableBalance' => $sampleClientData['playableBalance'],
					'currencyCode' => $sampleClientData['currencyCode'],
				],
			],
			$play
		);
	}

	public function testPlayShouldGetCorrectGameWindowDetailsWhenPlayerChanges()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUser(['clientID' => '234', 'currencyID' => '2', 'isTestPlayer' => '0']);
		$requestGameID = '123';
		$sampleGameData = $this->gameLobbyServiceGetGameWindowDetailsDataGame($requestGameID);
		$sampleClientData = $this->gameLobbyServiceGetGameWindowDetailsDataClient('234');

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);
		$play = $gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 0]));

		$this->assertEquals(
			[
				'url' => [
					'gameDetail' => $sampleGameData,
					'clientDetail' => $sampleClientData,
					'token' => [
						'options' => ['page' => 'Game', 'isMobileDevice' => 0],
						'gameDetail' => $sampleGameData,
						'clientID' => '234',
					],
				],
				'title' => $sampleGameData['gameName'],
				'maxPayout' => $sampleGameData['maxpayout'],
				'isMobile' => 0,
				'viewport' => 'desktop',
				'productID' => $sampleGameData['encryptedProductID'],
				'balanceInfo' => [
					'playableBalance' => $sampleClientData['playableBalance'],
					'currencyCode' => $sampleClientData['currencyCode'],
				],
			],
			$play
		);
	}

	public function testPlayShouldGetCorrectGameWindowDetailsWhenUsingMobile()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUserDefault();
		$requestGameID = '123';
		$sampleGameData = $this->gameLobbyServiceGetGameWindowDetailsDataGame($requestGameID);
		$sampleClientData = $this->gameLobbyServiceGetGameWindowDetailsDataClient('123');

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);
		$play = $gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 1]));

		$this->assertEquals(
			[
				'url' => [
					'gameDetail' => $sampleGameData,
					'clientDetail' => $sampleClientData,
					'token' => [
						'options' => ['page' => 'Game', 'isMobileDevice' => 1],
						'gameDetail' => $sampleGameData,
						'clientID' => '123',
					],
				],
				'title' => $sampleGameData['gameName'],
				'maxPayout' => $sampleGameData['maxpayout'],
				'isMobile' => 1,
				'viewport' => 'mobile',
				'productID' => $sampleGameData['encryptedProductID'],
				'balanceInfo' => [
					'playableBalance' => $sampleClientData['playableBalance'],
					'currencyCode' => $sampleClientData['currencyCode'],
				],
			],
			$play
		);
	}

	public function testPlayShouldAddEntryToRecentGame()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUserDefault();
		$requestGameID = '123';

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);

		$stubs['gameLobbyService']
			->expects($this->once())
			->method('setRecentGame')
			->with(
				[
					'page' => 'Game',
					'isMobileDevice' => 0,
				],
				Auth::user(),
				$requestGameID
			);

		$gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 0]));
	}

	public function testPlayShouldAddCorrectEntryToRecentGameWhenGameChanges()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUserDefault();
		$requestGameID = '234';

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);

		$stubs['gameLobbyService']
			->expects($this->once())
			->method('setRecentGame')
			->with(
				[
					'page' => 'Skill Games',
					'isMobileDevice' => 0,
				],
				Auth::user(),
				$requestGameID
			);

		$gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 0]));
	}

	public function testPlayShouldAddCorrectEntryToRecentGameWhenPlayerChanges()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUser(['clientID' => '234', 'currencyID' => '2', 'isTestPlayer' => '0']);
		$requestGameID = '123';

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);

		$stubs['gameLobbyService']
			->expects($this->once())
			->method('setRecentGame')
			->with(
				[
					'page' => 'Game',
					'isMobileDevice' => 0,
				],
				Auth::user(),
				$requestGameID
			);

		$gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 0]));
	}

	public function testPlayShouldAddCorrectEntryToRecentGameWhenUsingMobile()
	{
		$stubs = $this->playDefaultStubs();
		$this->stubAuthUserDefault();
		$requestGameID = '123';

		$gameController = $this->createController(
			$stubs['reponseFormatterService'],
			$stubs['gameLobbyService'],
			$stubs['utilsHelper']
		);

		$stubs['gameLobbyService']
			->expects($this->once())
			->method('setRecentGame')
			->with(
				[
					'page' => 'Game',
					'isMobileDevice' => 1,
				],
				Auth::user(),
				$requestGameID
			);

		$gameController->play(new PlayReq(['gameID' => $requestGameID, 'mobile' => 1]));
	}

	public function testDeleteGameSessionShouldDeleteInactiveGameSession()
	{
		$gameLobbyService = $this->mockGameLobbyService();
		$gameID = '123';
		$clientID = '123';
		$request = new DeleteGameSessionReq(['gameID' => $gameID, 'clientID' => $clientID]);

		$gameLobbyService
			->expects($this->once())
			->method('deleteInactiveGameSession')
			->with($request, 'api')
			->willReturn(['data' => []]);

		$gameController = $this->createController(null, $gameLobbyService);
		$gameController->deleteGameSession($request);
	}

	public function testDeleteGameSessionShouldDeleteCorrectInactiveGameSessionWhenGameIdChanges()
	{
		$gameLobbyService = $this->mockGameLobbyService();
		$gameID = '234';
		$clientID = '123';
		$request = new DeleteGameSessionReq(['gameID' => $gameID, 'clientID' => $clientID]);

		$gameLobbyService
			->expects($this->once())
			->method('deleteInactiveGameSession')
			->with($request, 'api')
			->willReturn(['data' => []]);

		$gameController = $this->createController(null, $gameLobbyService);
		$gameController->deleteGameSession($request);
	}

	public function testDeleteGameSessionShouldDeleteCorrectInactiveGameSessionWhenClientIdChanges()
	{
		$gameLobbyService = $this->mockGameLobbyService();
		$gameID = '123';
		$clientID = '234';
		$request = new DeleteGameSessionReq(['gameID' => $gameID, 'clientID' => $clientID]);

		$gameLobbyService
			->expects($this->once())
			->method('deleteInactiveGameSession')
			->with($request, 'api')
			->willReturn(['data' => []]);

		$gameController = $this->createController(null, $gameLobbyService);
		$gameController->deleteGameSession($request);
	}

	public function testCloseGameShouldDeleteInactiveGameSession()
	{
		$gameLobbyService = $this->mockGameLobbyService();
		$gameID = '123';
		$clientID = '123';
		$request = new CloseGameReq(['gameID' => $gameID, 'clientID' => $clientID]);

		$gameLobbyService
			->expects($this->once())
			->method('deleteInactiveGameSession')
			->with($request, 'ps')
			->willReturn(['data' => []]);

		$gameController = $this->createController(null, $gameLobbyService);
		$gameController->closeGame($request);
	}

	public function testCloseGameShouldDeleteCorrectInactiveGameSessionWhenGameIdChanges()
	{
		$gameLobbyService = $this->mockGameLobbyService();
		$gameID = '234';
		$clientID = '123';
		$request = new CloseGameReq(['gameID' => $gameID, 'clientID' => $clientID]);

		$gameLobbyService
			->expects($this->once())
			->method('deleteInactiveGameSession')
			->with($request, 'ps')
			->willReturn(['data' => []]);

		$gameController = $this->createController(null, $gameLobbyService);
		$gameController->closeGame($request);
	}

	public function testCloseGameShouldDeleteCorrectInactiveGameSessionWhenClientIdChanges()
	{
		$gameLobbyService = $this->mockGameLobbyService();
		$gameID = '123';
		$clientID = '234';
		$request = new CloseGameReq(['gameID' => $gameID, 'clientID' => $clientID]);

		$gameLobbyService
			->expects($this->once())
			->method('deleteInactiveGameSession')
			->with($request, 'ps')
			->willReturn(['data' => []]);

		$gameController = $this->createController(null, $gameLobbyService);
		$gameController->closeGame($request);
	}

	public function testGetGameCategoriesShouldGetGameLobbyCategories()
	{
		$this->stubAuthUserDefault();
		$gameLobbyService = $this->mockGameLobbyService();
		$request = new GetGameCategories(['page' => 'Games']);
		$gameController = $this->createController(null, $gameLobbyService);

		$gameLobbyService
			->expects($this->once())
			->method('getGameCategories')
			->with($request, '123')
			->willReturn(['data' => []]);

		$gameController->getGameCategories($request);
	}

	public function testGetGameCategoriesShouldGetCorrectGameLobbyCategoriesWhenPageChanges()
	{
		$this->stubAuthUserDefault();
		$gameLobbyService = $this->mockGameLobbyService();
		$request = new GetGameCategories(['page' => 'Skill Games']);
		$gameController = $this->createController(null, $gameLobbyService);

		$gameLobbyService
			->expects($this->once())
			->method('getGameCategories')
			->with($request, '123')
			->willReturn(['data' => []]);

		$gameController->getGameCategories($request);
	}

	public function testGetGameCategoriesShouldGetCorrectGameLobbyCategoriesWhenUsingMobile()
	{
		$this->stubAuthUser(['clientID' => '234', 'currencyID' => '2', 'isTestPlayer' => '0']);
		$gameLobbyService = $this->mockGameLobbyService();
		$request = new GetGameCategories(['page' => 'Skill Games']);
		$gameController = $this->createController(null, $gameLobbyService);

		$gameLobbyService
			->expects($this->once())
			->method('getGameCategories')
			->with($request, '234')
			->willReturn(['data' => []]);

		$gameController->getGameCategories($request);
	}
}
