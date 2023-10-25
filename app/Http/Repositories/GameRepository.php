<?php

namespace App\Http\Repositories;

use App\Models\Game;
use App\Models\GameSessionLog;
use App\Models\GameLoginSessionLog;
use App\Models\GameCurrency;
use App\Models\GameType;
use App\Models\GameLoginSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redis;
use Config;
use Arr;

class GameRepository extends BaseRepository
{
	public function getGameDetail($gameID, $currencyID)
	{
		$result = Game::select(
			'game.gameID',
			'game.gameName',
			'game.isTestModeEnabled',
			'game.url',
			'game.productID',
			'game.gameProviderID',
			'gamecurrency.maxpayout'
		)
			->join('gamecurrency', 'gamecurrency.gameID', 'game.gameID')
			->where('game.gameID', $gameID)
			->where('gamecurrency.currencyID', $currencyID)
			->first();

		return empty($result) ? [] : $result->toArray();
	}

	/**
	 * getGame
	 *
	 * @param  mixed     $params	 [
	 * 							     	clientID        int    clientID
	 * 							     	currencyID      int    currencyID
	 * 								 	productIDs      array  list of productIds
	 * 								 	isMobileDevice  int    1|0
	 * 								 	isTestPlayer    int    1|0
	 * 							    	gameTypeOrder   array  gameTypes in order
	 *                              ]
	 * @param  callable  $formatter
	 * @return void
	 */
	public function getGame($params, $formatter = null)
	{
		$game = Game::select(
			'game.gameID',
			'game.gameName',
			'game.isPreviewEnabled',
			'game.timestampReleased',
			'game.gameProviderID',
			'game.isCertified',
			'game.rank',
			'game.gameTypeRank',
			'gametype.gameTypeName',
			'gametype.gameTypeID'
		)
			->selectIsNew()
			->join('gametype', 'gametype.gameTypeID', 'game.gameTypeID')
			->join('gamecurrency', 'gamecurrency.gameID', 'game.gameID')
			->where('gamecurrency.currencyID', '=', $params['currencyID'])
			->whereIn('game.productID', $params['productIDs'])
			->orderByInterest();

		if ($params['isMobileDevice']) {
			$game = $game->isMobile();
		} else {
			$game = $game->isDesktop();
		}

		if ($params['isTestPlayer']) {
			$game = $game->selectAllowTestPlayer();
		} else {
			$game = $game->selectIsAvailable();
		}

		$result = $game->get()->toArray();

		$gameTypeOrder = $params['gameTypeOrder'];
		$gameTypeOrderLength = count($gameTypeOrder);
		$gameTypeNames = [];
		$addedGameType = 0;

		foreach ($result as &$game) {
			if (is_callable($formatter)) {
				$formatter($game);
			}

			if (!in_array($game['gameTypeName'], $gameTypeNames) && $gameTypeOrderLength > $addedGameType) {
				$key = array_search($game['gameTypeID'], $gameTypeOrder);

				if ($key !== false) {
					$gameTypeNames[$key] = $game['gameTypeName'];
					$addedGameType++;
				}
			}
		}

		ksort($gameTypeNames);

		return [
			'list' => $result,
			'gameTypeNames' => $gameTypeNames,
		];
	}

	public function getBsiTopGames($productIDs)
	{
		return Game::select('game.gameName', 'game.rank', 'game.gameProviderID')
			->orderByTopGames()
			->limit(10)
			->whereIn('game.productID', $productIDs)
			->isDesktop()
			->get()
			->toArray();
	}

	public function getBsiNewGames($productIDs)
	{
		return Game::select('game.gameName', 'game.rank', 'game.gameProviderID')
			->selectIsNew()
			->whereIn('game.productID', $productIDs)
			->isDesktop()
			->orderBy('timestampReleased', 'DESC')
			->limit(10)
			->get()
			->toArray();
	}

	public function getGameGuideList($languageCode)
	{
		return Game::select('game.gameName', 'product.productName', 'gametype.gameTypeName', 'gameguide.url')
			->selectIsNew()
			->join('product', 'product.productID', '=', 'game.productID')
			->join('gametype', 'gametype.gameTypeID', '=', 'game.gameTypeID')
			->join('gameguide', 'gameguide.gameID', '=', 'game.gameID')
			->join('language', 'language.languageID', '=', 'gameguide.languageID')
			->where('language.languageCode', $languageCode)
			->orderByInterest()
			->get()
			->toArray();
	}

	private function getGameSession($productIDGroup, $sboClientID)
	{
		return GameLoginSession::select(
			'gameloginsession.gameLoginSessionID',
			'gameloginsession.gameID',
			'getlogininfo.sboClientID'
		)
			->join('game', 'game.gameID', 'gameloginsession.gameID')
			->join('getlogininfo', 'getlogininfo.getLoginInfoID', 'gameloginsession.getLoginInfoID')
			->whereIn('game.productID', $productIDGroup)
			->where('getlogininfo.sboClientID', $sboClientID)
			->get();
	}

	public function createGameSession($newSession)
	{
		// delete existing gamesession
		$existingGameSession = $this->getGameSession($newSession['productIDGroup'], $newSession['sboClientID']);
		if (count($existingGameSession)) {
			$this->deleteGameSession($existingGameSession);
		}

		// create new gamesession
		$gameSession = new GameLoginSession();
		$gameSession->gameID = $newSession['gameID'];
		$gameSession->token = $newSession['token'];
		$gameSession->userDevice = $newSession['userDevice'];
		$gameSession->ipAddress = $newSession['ipAddress'];
		$gameSession->getLoginInfoID = $newSession['getLoginInfoID'];
		$gameSession->gameMachineName = $newSession['gameName'];
		$gameSession->timestampCreated = Carbon::now();
		$savedGameSession = $gameSession->save();

		if ($savedGameSession) {
			$this->createGameSessionLog(Arr::except($newSession, 'token'));
		}

		return $savedGameSession;
	}

	public function updateGameSession($newSession, $sboClientID)
	{
		return GameLoginSession::join('getlogininfo', 'getlogininfo.getLoginInfoID', 'gameloginsession.getLoginInfoID')
			->where('gameloginsession.gameID', $newSession['gameID'])
			->where('getlogininfo.sboClientID', $sboClientID)
			->update([
				'gameloginsession.getLoginInfoID' => $newSession['getLoginInfoID'],
				'token' => $newSession['token'],
				'userDevice' => $newSession['userDevice'],
				'ipAddress' => $newSession['ipAddress'],
			]);
	}

	private function deleteGameSession($gameSessionCollection)
	{
		$gameSessionIDs = $gameSessionCollection->pluck('gameLoginSessionID')->toArray();
		$gameSessionDelete = GameLoginSession::bmWhereInOrEqual('gameLoginSessionID', $gameSessionIDs)->delete();

		if ($gameSessionDelete) {
			$gameSessionData = $gameSessionCollection
				->map(function ($user) {
					return collect($user)->only(['sboClientID', 'gameID']);
				})
				->toArray();
			$this->updateGameSessionLog($gameSessionData);
		}

		return $gameSessionDelete;
	}

	private function createGameSessionLog($newSession)
	{
		$gameSessionLog = new GameLoginSessionLog();
		$gameSessionLog->gameID = $newSession['gameID'];
		$gameSessionLog->sboClientID = $newSession['sboClientID'];
		$gameSessionLog->userDevice = $newSession['userDevice'];
		$gameSessionLog->ipAddress = $newSession['ipAddress'];
		$gameSessionLog->gameMachineName = $newSession['gameName'];
		$gameSessionLog->timeStampStart = Carbon::now();

		return $gameSessionLog->save();
	}

	private function updateGameSessionLog($gameSessionData)
	{
		return GameLoginSessionLog::bmWhereInMulti($gameSessionData)
			->whereNull('timeStampEnd')
			->update(['timeStampEnd' => Carbon::now()]);
	}

	public function deleteInactiveGameSession($sboClientIDs, $gameIDs = null)
	{
		$deleteGameSessionRows = GameLoginSession::select(
			'gameloginsession.gameLoginSessionID',
			'gameloginsession.gameID',
			'getlogininfo.sboClientID'
		)
			->join('getlogininfo', 'getlogininfo.getLoginInfoID', 'gameloginsession.getLoginInfoID')
			->leftJoin('transactioncw', function ($join) {
				$join
					->on('transactioncw.gameID', '=', 'gameloginsession.gameID')
					->on('transactioncw.sboClientID', '=', 'getlogininfo.sboClientID')
					->where('transactioncw.event', '=', 'R');
			})
			->bmWhereInOrEqual('getlogininfo.sboClientID', $sboClientIDs);

		if ($gameIDs !== null) {
			$deleteGameSessionRows = $deleteGameSessionRows->bmWhereInOrEqual('gameloginsession.gameID', $gameIDs);
		}

		$deleteGameSessionRows = $deleteGameSessionRows->whereNull('transactioncw.transactionCWID')->get();

		if (count($deleteGameSessionRows)) {
			return $this->deleteGameSession($deleteGameSessionRows);
		} else {
			return null;
		}
	}

	public function getMaxPayout($clientID, $gameID)
	{
		$result = GameCurrency::select('gamecurrency.maxpayout')
			->join('client', 'client.currencyID', 'gamecurrency.currencyID')
			->where('clientID', $clientID)
			->where('gamecurrency.gameID', $gameID)
			->first();
		return empty($result) ? null : $result->maxpayout;
	}

	public function isSupportedCurrency($productIDs, $currencyID)
	{
		return Game::join('gamecurrency', 'gamecurrency.gameID', 'game.gameID')
			->whereIn('game.productID', $productIDs)
			->where('gamecurrency.currencyID', $currencyID)
			->count() > 0;
	}

	public function getGameTypes($gameTypeOrder)
	{
		$gameTypeOrderArray = explode(',', $gameTypeOrder);
		return GameType::select('gameTypeName')
			->whereIn('gameTypeID', $gameTypeOrderArray)
			->orderByRaw('FIELD(gameTypeID , ' . $gameTypeOrder . ') ASC')
			->pluck('gameTypeName')
			->toArray();
	}

	/**
	 * set
	 *
	 * @param  array $params      [
	 *                              page           string   Page for recent games
	 * 								gameID         int      gameID
	 *	                            clientID       int      clientID
	 *                              limit          int      limit recent games entry
	 * 								isMobileDevice boolean
	 * 							  ]
	 * @return void
	 */
	public function setRecentGame($params)
	{
		$gameID = $params['gameID'];
		$page = $params['page'];
		$sboClientID = $params['sboClientID'];
		$limit = $params['limit'];
		$isMobileDevice = $params['isMobileDevice'];

		$recentGames = $this->getRecentGame($page, $sboClientID, $isMobileDevice);
		$recentGames = empty($recentGames) ? [] : explode(';', $recentGames);

		if (($key = array_search($gameID, $recentGames)) !== false) {
			unset($recentGames[$key]);
		}

		array_unshift($recentGames, $gameID);
		$recentGames = array_slice($recentGames, 0, $limit);
		Redis::hSet($this->recentGameKey($page, $isMobileDevice), $sboClientID, implode(';', $recentGames));
	}

	public function getRecentGame($page, $sboClientID, $isMobileDevice)
	{
		$recentGames = Redis::hGet($this->recentGameKey($page, $isMobileDevice), $sboClientID);

		return $recentGames != false ? $recentGames : '';
	}

	private function recentGameKey($page, $isMobileDevice)
	{
		$isMobileDevice = $isMobileDevice ? 1 : 0;
		return Config::get('cache.prefix') . ':recentgames' . $page . $isMobileDevice;
	}

	public function getRunningGame($productIDs, $sboClientID)
	{
		$result = Game::select('game.gameID', 'game.gameName', 'game.device')
			->join('transactioncw', 'game.gameID', 'transactioncw.gameID')
			->whereIn('game.productID', $productIDs)
			->where('transactioncw.sboClientID', $sboClientID)
			->where('transactioncw.event', 'R')
			->first();
		return empty($result) ? [] : $result->toArray();
	}
}
