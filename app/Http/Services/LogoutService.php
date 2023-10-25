<?php

namespace App\Http\Services;

use App\Http\Containers\ClientDbContainer;
use App\Http\Containers\ClientOtherSourceContainer;

class LogoutService
{
	private $clientDbContainer;
	private $clientOtherSourceContainer;

	public function __construct(
		ClientDbContainer $clientDbContainer,
		ClientOtherSourceContainer $clientOtherSourceContainer,)
	{
		$this->clientDbContainer = $clientDbContainer;
		$this->clientOtherSourceContainer = $clientOtherSourceContainer;
	}

	public function logoutClientData($clientIDs, $sessionHandler = null, $isLogoutThirdParty = true)
	{
		$getLoginInfoIds = $this->clientOtherSourceContainer->sessionService()->getLoginInfoReferenceID($clientIDs);

		if ($isLogoutThirdParty) {
			if (is_array($getLoginInfoIds)) {
				foreach ($getLoginInfoIds as $getLoginInfoId) {
					$this->logoutThirdParty($getLoginInfoId);
				}
			} else {
				$this->logoutThirdParty($getLoginInfoIds);
			}
		}

		if (is_callable($sessionHandler)) {
			$isSessionAffected = $sessionHandler();
		} else {
			$isSessionAffected = $this->clientOtherSourceContainer->sessionService()->logoutClientID($clientIDs);
		}

		$clientRepository = $this->clientDbContainer->clientRepository();
		$usernames = $clientRepository->getClientUsername($getLoginInfoIds);
		$clientRepository->updateLoginLog($usernames);

		// no more deletion of gamesession
		$gameRepository = $this->clientDbContainer->gameRepository();
		$gameRepository->deleteInactiveGameSession($clientIDs);

		return $isSessionAffected;
	}

	private function logoutThirdParty($referenceID)
	{
		$this->clientOtherSourceContainer->zirconApiService()->logout($referenceID, true);
	}
}
