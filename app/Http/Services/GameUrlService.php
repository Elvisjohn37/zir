<?php

namespace App\Http\Services;
use App\Http\Repositories\AppRepository;
use App\Http\Containers\EncryptionContainer;
use App\Http\Services\LanguageService;
use URL;

class GameUrlService
{
	private $appRepository;
	private $encryptionContainer;
	private $languageService;

	public function __construct(
		AppRepository $appRepository,
		EncryptionContainer $encryptionContainer,
		LanguageService $languageService
	) {
		$this->appRepository = $appRepository;
		$this->encryptionContainer = $encryptionContainer;
		$this->languageService = $languageService;
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
	 * @return void
	 */
	public function createGameUrl($gameDetail, $clientDetail, $token)
	{
		$psUrl = $this->appRepository->getPsUrl();
		$gameUrl = replaceDomain($gameDetail['url'], $psUrl);
		$params = $this->getGameParams($gameDetail, $clientDetail, $token);

		return urlAddQuery($gameUrl, $params);
	}

	/**
	 * getGameParams
	 *
	 * @param  mixed $gameDetail     [
	 * 								    gameID           int
	 * 									gameProviderID   int
	 *                                  encryptedGameID  string
	 * 								 ]
	 * @param  mixed $clientDetail   [
	 * 								    clientID         int
	 * 								    currencyCode     string
	 * 								 ]
	 * @param  mixed $token
	 * @return void
	 */
	private function getGameParams($gameDetail, $clientDetail, $token)
	{
		$gameID = $gameDetail['gameID'];
		$clientID = $clientDetail['sboClientID'];

		switch ($gameDetail['gameProviderID']) {
			case 2:
				return [
					'token' => $token,
					'lang' => $this->languageService->getCurrent(),
					'homeURL' =>
						URL::to('/closegame') .
						'?gameID=' .
						$gameDetail['encryptedGameID'] .
						'&clientID=' .
						$this->encryptionContainer->hashId()->encode($clientID),
				];

			default:
				return [
					'token' => $token,
					'gameID' => $gameID,
					'lang' => $this->languageService->getCurrent(),
				];
		}
	}
}
