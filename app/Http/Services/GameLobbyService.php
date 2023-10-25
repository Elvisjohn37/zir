<?php

namespace App\Http\Services;

use App\Http\Services\GameUrlService;
use App\Http\Containers\EncryptionContainer;
use Config;
use App\Http\Containers\GameLobbyRepositoryContainer;

class GameLobbyService
{
	private $gameRepository;
	private $clientRepository;
	private $referenceRepository;
	private $gameUrlService;
	private $encryptionContainer;

	function __construct(
		GameLobbyRepositoryContainer $gameLobbyRepositoryContainer,
		GameUrlService $gameUrlService,
		EncryptionContainer $encryptionContainer
	) {
		$this->gameRepository = $gameLobbyRepositoryContainer->gameRepository;
		$this->clientRepository = $gameLobbyRepositoryContainer->clientRepository;
		$this->referenceRepository = $gameLobbyRepositoryContainer->referenceRepository;
		$this->gameUrlService = $gameUrlService;
		$this->encryptionContainer = $encryptionContainer;
	}

	private function success($data = 'success')
	{
		return ['result' => true, 'data' => $data];
	}

	private function error($data)
	{
		return ['result' => false, 'data' => $data];
	}

	/**
	 * getGame
	 *
	 * @param  object $request [
	 * 								page           string
	 * 								isMobileDevice int
	 * 						   ]
	 * @param  mixed $user     [
	 * 								clientID     int
	 * 								currencyID   int
	 * 								isTestPlayer int
	 * 						   ]
	 * @return void
	 */
	public function getGame($request, $user)
	{
		$page = $request->page;
		$isMobileDevice = $request->isMobileDevice;
		$currencyID = $this->referenceRepository->getCurrencyID($user->currencyCode);
		$isTestPlayer = $this->clientRepository->isTestPlayer($user->sboClientID);

		$games = $this->gameRepository->getGame(
			[
				'currencyID' => $currencyID,
				'productIDs' => $this->getPageProductIDs($page),
				'isMobileDevice' => $isMobileDevice,
				'isTestPlayer' => $isTestPlayer,
				'gameTypeOrder' => explode(',', Config::get('custom.games.gameTypeOrder')[$request->get('page')]),
			],
			function (&$game) {
				$game['gameID'] = $this->encryptGameID($game['gameID']);
				$game['isTop'] = $game['rank'] <= Config::get('custom.games.topLimit') ? 1 : 0;
			}
		);

		if (empty($games['list'])) {
			return $this->error('GameNotFound');
		} else {
			return $this->success($games);
		}
	}

	public function getBsiGames($request)
	{
		$page = $request->page;
		$isMobileDevice = $request->isMobileDevice;
		$bsiGame = $this->gameRepository->getBsiGames([
			'productIDs' => $this->getPageProductIDs($page),
			'isMobileDevice' => $isMobileDevice,
		]);
		if (empty($bsiGame)) {
			return $this->error('GameNotFound');
		} else {
			return $this->success($bsiGame);
		}
	}

	/**
	 * getRecentGame
	 *
	 * @param  array  $options  [
	 * 								page            string  page requested
	 * 								isMobileDevice  int     flag if mobile device
	 *							]
	 * @param  object $user     [clientID int]
	 * @return array
	 */
	public function getRecentGame($options, $user)
	{
		$page = $options['page'];
		$isMobileDevice = $options['isMobileDevice'];

		$sboClientID = $user->sboClientID;

		return $this->success($this->gameRepository->getRecentGame($page, $sboClientID, $isMobileDevice));
	}

	/**
	 * setRecentGame
	 *
	 * @param  array  $options  [
	 * 								page            string  page requested
	 * 								isMobileDevice  int     flag if mobile device
	 *							]
	 * @param  object $user     [clientID int]
	 * @param  int    $gameID   gameID
	 * @return void
	 */
	public function setRecentGame($options, $user, $gameID)
	{
		$page = $options['page'];
		$isMobileDevice = $options['isMobileDevice'];

		$this->gameRepository->setRecentGame([
			'page' => $page,
			'gameID' => $this->encryptGameID($gameID),
			'sboClientID' => $user->sboClientID,
			'limit' => Config::get('custom.games.recentLimit'),
			'isMobileDevice' => $isMobileDevice,
		]);
	}

	public function getPageProductIDs($page)
	{
		return explode(',', Config::get('custom.games.productIDs')[$page]);
	}

	public function getGameWindowDetails($requestGameID, $user)
	{
		$gameID = $this->decryptGameID($requestGameID);
		$currencyID = $this->referenceRepository->getCurrencyID($user->currencyCode);

		$gameDetail = $this->gameRepository->getGameDetail($gameID, $currencyID);

		if (empty($gameDetail)) {
			return $this->error('NotFound');
		}

		if ($gameDetail['isTestModeEnabled'] && !$user['isTestPlayer']) {
			return $this->error('TestMode');
		}

		$gameDetail['encryptedGameID'] = $requestGameID;
		$gameDetail['encryptedProductID'] = $this->encryptionContainer->hashId()->encode($gameDetail['productID']);
		return $this->success($gameDetail);
	}

	/**
	 * createOrUpdateGameSession
	 *
	 * @param  mixed $options    [
	 * 								 page            string
	 * 								 isMobileDevice  int
	 * 						     ]
	 * @param  mixed $gameDetail [
	 * 								 gameID     int
	 * 								 gameName   string
	 *                               productID  int
	 * 						     ]
	 * @param  int   $clientID
	 * @return array
	 */
	public function createOrUpdateGameSession($options, $gameDetail, $user)
	{
		$pageProductIDs = $this->getPageProductIDs($options['page']);
		$token = generateToken(32);

		$newSession = [
			'productIDGroup' => $pageProductIDs,
			'gameID' => $gameDetail['gameID'],
			'gameName' => $gameDetail['gameName'],
			'getLoginInfoID' => $user->getLoginInfoID,
			'sboClientID' => $user->sboClientID,
			'token' => $token,
			'userDevice' => $options['isMobileDevice'] ? 'Mobile' : 'Desktop',
			'ipAddress' => get_ip(),
		];

		$runningGame = $this->gameRepository->getRunningGame($pageProductIDs, $user->sboClientID);

		if (empty($runningGame)) {
			$isSuccess = $this->gameRepository->createGameSession($newSession);
		} else {
			if ($runningGame['gameID'] == $gameDetail['gameID']) {
				$isSuccess = $this->gameRepository->updateGameSession($newSession, $user->sboClientID);
			} else {
				$isDesktopOnMobile = $options['isMobileDevice'] && $runningGame['device'] == 0;
				$isMobileOnDesktop = !$options['isMobileDevice'] && $runningGame['device'] == 1;

				$runningGameData = [
					'title' => $gameDetail['gameName'],
					'gameName' => $gameDetail['gameName'],
					'runningGameName' => $runningGame['gameName'],
					'runningGameID' => $this->encryptGameID($runningGame['gameID']),
				];

				if ($isDesktopOnMobile || $isMobileOnDesktop) {
					return $this->error(['code' => 'RunningGameCrossDevice', 'runningGameData' => $runningGameData]);
				} else {
					return $this->error(['code' => 'RunningGame', 'runningGameData' => $runningGameData]);
				}
			}
		}

		if (!$isSuccess) {
			return $this->error(['code' => 'FailedCreateOrUpdate']);
		} else {
			return $this->success($newSession);
		}
	}

	/**
	 * createGameUrl
	 *
	 * @param  array  $gameDetail   [
	 * 								    url              string
	 * 								    gameID           int
	 * 									gameProviderID   int
	 *                                  encryptedGameID  string
	 * 								]
	 * @param  array  $clientDetail [
	 * 								    clientID         int
	 * 								    currencyCode     string
	 * 								]
	 * @param  string $token
	 * @return string
	 */
	public function createGameUrl($gameDetail, $clientDetail, $token)
	{
		return $this->success($this->gameUrlService->createGameUrl($gameDetail, $clientDetail, $token));
	}

	private function encryptGameID($gameID)
	{
		return $this->encryptionContainer->hashId()->encode($gameID);
	}

	private function decryptGameID($gameID)
	{
		return $this->encryptionContainer->hashId()->decode($gameID)[0];
	}

	public function deleteInactiveGameSession($request, $from)
	{
		switch ($from) {
			case 'api':
				$clientID = $request->clientID;
				$gameID = $request->gameID;
				break;
			default:
				$clientID = $this->encryptionContainer->hashId()->decode($request->clientID)[0];
				$gameID = $this->encryptionContainer->hashId()->decode($request->gameID)[0];
		}

		$deletedGameSession = $this->gameRepository->deleteInactiveGameSession($clientID, $gameID);
		return $this->success(['deleted' => $deletedGameSession]);
	}

	/**
	 * getGameCategories
	 *
	 * @param  object $request   [
	 *								page            string
	 *								isMobileDevice  string  optional
	 *							 ]
	 * @param  int    $clientID
	 * @return array
	 */
	public function getGameCategories($request, $clientID = null)
	{
		$gameTypeOrder = Config::get('custom.games.gameTypeOrder')[$request->page];
		$productIDs = Config::get('custom.games.productIDs')[$request->page];
		$isMobileDevice = $request->has('isMobileDevice') ? $request->isMobileDevice : 1;

		$gameCategories = ['gameTypes' => $this->gameRepository->getGameTypes($gameTypeOrder)];

		if (empty($clientID)) {
			return $this->success($gameCategories);
		} else {
			return $this->success(
				array_merge($gameCategories, [
					'hasRecentGames' => !empty(
						$this->gameRepository->getRecentGame($productIDs, $clientID, $isMobileDevice)
					),
				])
			);
		}
	}
}
