<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlayReq;
use App\Http\Requests\GetGameReq;
use App\Http\Requests\GetBsiGameReq;
use App\Http\Requests\DeleteGameSessionReq;
use App\Http\Requests\CloseGameReq;
use App\Http\Requests\GetGameCategories;
use App\Exceptions\GameRestrictionException;
use App\Exceptions\GameTestModeException;
use App\Exceptions\RunningGameException;
use App\Http\Services\ResponseFormatterService;
use App\Http\Services\GameLobbyService;
use App\Http\Services\HomeService;
use App\Helpers\ArrayHelper;
use Auth;
use UnexpectedValueException;
use Config;
use App\Http\Containers\ClientDataContainer;

class GameController extends BaseController
{
	private $responseFormatter;
	private $gameLobbyService;
	private $homeService;
	private $arrayHelper;
	private $clientDataContainer;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		GameLobbyService $gameLobbyService,
		HomeService $homeService,
		ArrayHelper $arrayHelper,
		ClientDataContainer $clientDataContainer
	) {
		$this->responseFormatter = $responseFormatter;
		$this->gameLobbyService = $gameLobbyService;
		$this->homeService = $homeService;
		$this->arrayHelper = $arrayHelper;
		$this->clientDataContainer = $clientDataContainer;
	}

	public function getGame(GetGameReq $request)
	{
		$user = Auth::user();
		$games = $this->gameLobbyService->getGame($request, $user);

		if ($games['result'] === false) {
			throw new GameTestModeException('No game found for page ' . $request->get('page'));
		}

		return $this->responseFormatter->success(
			array_merge(
				[
					'recentLimit' => Config::get('custom.games.recentLimit'),
					'recentGames' => $this->gameLobbyService->getRecentGame(
						[
							'page' => $request->page,
							'isMobileDevice' => $request->isMobileDevice,
						],
						$user
					)['data'],
				],
				$games['data']
			)
		);
	}

	public function getBsiGames(GetBsiGameReq $request)
	{
		$bsiGames = $this->homeService->getBsiGames($request);
		return $this->responseFormatter->success([
			'newGames' => $bsiGames['data']['newGames'],
			'topGames' => $bsiGames['data']['topGames'],
			...$this->gameLobbyService->getGameCategories($request)['data'],
		]);
	}

	public function play(PlayReq $request)
	{
		$user = Auth::user();
		$isMobileDevice = $request->mobile == 1 ? 1 : 0;
		$gameWindowDetails = $this->gameLobbyService->getGameWindowDetails($request->gameID, $user);

		if (!$gameWindowDetails['result']) {
			switch ($gameWindowDetails['data']) {
				case 'Restricted':
					throw new GameRestrictionException($gameWindowDetails);
				default:
					throw new GameTestModeException($gameWindowDetails);
			}
		}

		$gameDetail = $gameWindowDetails['data'];
		$productID = $gameDetail['productID'];
		$pageProductIDs = Config::get('custom.games.productIDs');

		$page = $this->arrayHelper->findKey($pageProductIDs, function ($productIDs) use ($productID) {
			$explodeProductIDs = explode(',', $productIDs);
			return in_array($productID, $explodeProductIDs);
		});

		$gameSession = $this->gameLobbyService->createOrUpdateGameSession(
			['page' => $page, 'isMobileDevice' => $isMobileDevice],
			$gameDetail,
			$user
		);

		if (!$gameSession['result']) {
			switch ($gameSession['data']['code']) {
				case 'RunningGameCrossDevice':
					throw new RunningGameException(
						'There is running game on other type of device',
						array_merge($gameSession['data']['runningGameData'], [
							'gameID' => $request->gameID,
						]),
						$isMobileDevice ? 'mobile' : 'desktop'
					);
				case 'RunningGame':
					throw new RunningGameException('There is running game', $gameSession['data']['runningGameData']);
				default:
					throw new UnexpectedValueException('Failed on inserting or updating the gamesession table');
			}
		}

		$this->gameLobbyService->setRecentGame(
			[
				'page' => $page,
				'isMobileDevice' => $isMobileDevice,
			],
			$user,
			$gameDetail['gameID']
		);

		$gameURL = $this->gameLobbyService->createGameUrl($gameDetail, $user, $gameSession['data']['token']);
		$apiAccountBalance = $this->clientDataContainer->zirconApiService()->getBalance(Auth::user()->getLoginInfoID);

		return $this->responseFormatter->success([
			'url' => $gameURL['data'],
			'title' => $gameDetail['gameName'],
			'maxPayout' => $gameDetail['maxpayout'],
			'isMobile' => $isMobileDevice,
			'viewport' => $isMobileDevice ? 'mobile' : 'desktop',
			'productID' => $gameDetail['encryptedProductID'],
			'balanceInfo' => [
				'playableBalance' => $apiAccountBalance['data']['balance'],
				'currencyCode' => Auth::user()->currencyCode,
			],
		]);
	}

	public function deleteGameSession(DeleteGameSessionReq $request)
	{
		return $this->responseFormatter->success(
			$this->gameLobbyService->deleteInactiveGameSession($request, 'api')['data']
		);
	}

	public function closeGame(CloseGameReq $request)
	{
		return $this->responseFormatter->success(
			$this->gameLobbyService->deleteInactiveGameSession($request, 'ps')['data']
		);
	}

	public function getGameCategories(GetGameCategories $request)
	{
		return $this->responseFormatter->success(
			$this->gameLobbyService->getGameCategories($request, Auth::user()->clientID)['data']
		);
	}
}
