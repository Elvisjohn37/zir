<?php

namespace App\Http\Controllers;

use Redirect;
use Config;
use App\Http\Requests\LoginReq;
use App\Http\Requests\LogoutClientReq;
use App\Http\Requests\GetClientSessionReq;
use App\Http\Requests\UpdateActivityReq;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\GameRestrictionException;
use App\Http\Containers\ClientDataContainer;
use App\Http\Containers\ClientConfigContainer;
use App\Http\Containers\ClientServiceContainer;
use Auth;
use UnexpectedValueException;

class ClientController extends BaseController
{
	private $responseFormatter;
	private $clientStatusValidatorService;
	private $clientDataContainer;
	private $clientConfigContainer;
	private $clientConvertService;

	public function __construct(
		ClientServiceContainer $clientServiceContainer,
		ClientDataContainer $clientDataContainer,
		ClientConfigContainer $clientConfigContainer
	) {
		$this->responseFormatter = $clientServiceContainer->responseFormatter;
		$this->clientStatusValidatorService = $clientServiceContainer->clientStatusValidatorService;
		$this->clientConvertService = $clientServiceContainer->clientConvertService;
		$this->clientDataContainer = $clientDataContainer;
		$this->clientConfigContainer = $clientConfigContainer;
	}

	public function getBalance()
	{
		$apiAccountBalance = $this->clientDataContainer->zirconApiService()->getBalance(Auth::user()->getLoginInfoID);

		if (empty($apiAccountBalance)) {
			throw new UnexpectedValueException('Client doesn\'t have balance');
		}

		return $this->responseFormatter->success([
			'playableBalance' => $apiAccountBalance['data']['balance'],
			'currencyCode' => Auth::user()->currencyCode,
		]);
	}
	public function login(LoginReq $request)
	{
		$clientRepository = $this->clientDataContainer->clientRepository();
		$isIpBlacklisted = $this->clientDataContainer->clientIpBlackList();
		$isMobileSite = $this->clientConfigContainer->mobileSiteService()->isMobileSite();
		$sessionService = $this->clientDataContainer->sessionService();

		if ($isIpBlacklisted) {
			throw new UnauthorizedException('Login IP blocked');
		}

		$ziconApiService = $this->clientDataContainer->zirconApiService();
		if ($isMobileSite) {
			$loginDetail = $ziconApiService->getMobileLoginDetail($request->id);
		} else {
			$loginDetail = $ziconApiService->getLoginDetail($request->token);
		}

		if (!$loginDetail) {
			throw new UnauthorizedException('Login API invalid return value', $loginDetail);
		}

		if (!$this->clientStatusValidatorService->isAllowedLogin($loginDetail['globalStatus'])) {
			throw new GameRestrictionException('Client status is not open');
		}

		// logout if some client is still active in same browser
		if (Auth::check()) {
			$this->clientDataContainer->logoutService()->logoutClientData($sessionService->getClientID(), null, false);
		}

		// logout if the account is still login anywhere
		if ($sessionService->isClientLogin($loginDetail['clientID'])) {
			$this->clientDataContainer->logoutService()->logoutClientData($loginDetail['clientID'], null, false);
		}

		Auth::loginUsingId($loginDetail['referenceID']);

		if (Auth::check()) {
			// no need to set own initial language cookie if mobile, we will use SBO cookie
			if (!$isMobileSite) {
				$this->clientConfigContainer->languageService()->setFromSbo($loginDetail['language']);
			}

			$ip = $this->clientDataContainer->userAgentHelper()->getIp();
			$clientRepository->createLoginLog($loginDetail['accountID'], $ip);
			$sessionService->setLoginSessions($loginDetail);
			return Redirect::to(Config::get('custom.login.routeOnSuccess'));
		} else {
			throw new UnauthorizedException('Unable to login to session', $loginDetail);
		}
	}

	public function getSession()
	{
		$responseData = ['isLogin' => Auth::check()];

		if ($responseData['isLogin']) {
			$responseData['user'] = [
				'isWalkin' => $this->clientConvertService->isWalkin(),
				'jurisdiction' => $this->clientConvertService->jurisdiction(),
			];
		}

		return $this->responseFormatter->success($responseData);
	}

	public function logout()
	{
		if (Auth::check()) {
			$this->clientDataContainer->logoutService()->logoutClientData(Auth::user()->sboClientID, function () {
				$this->clientDataContainer->sessionService()->logoutOwnSessions();
			});
		}

		return $this->responseFormatter->success(['message' => 'Logout', 'isLogin' => Auth::check()]);
	}

	public function inActivePlayers()
	{
		$inActiveClientIDs = $this->clientDataContainer->sessionService()->getAllInactiveClientIDs();

		if (empty($inActiveClientIDs)) {
			return $this->responseFormatter->success(['affected' => 0]);
		} else {
			$this->clientDataContainer->logoutService()->logoutClientData($inActiveClientIDs);
			return $this->responseFormatter->success(['affected' => count($inActiveClientIDs)]);
		}
	}

	public function logoutAll()
	{
		$loginClientIDs = $this->clientDataContainer->sessionService()->getAllLoginClientID();

		if (empty($loginClientIDs)) {
			return $this->responseFormatter->success(['affectedSessions' => 0]);
		} else {
			$affectedSessions = $this->clientDataContainer
				->logoutService()
				->logoutClientData($loginClientIDs, function () {
					return $this->clientDataContainer->sessionService()->logoutAllSessions();
				});

			return $this->responseFormatter->success(['affectedSessions' => $affectedSessions]);
		}
	}

	public function logoutClientID(LogoutClientReq $request)
	{
		$clientID = $request->input('clientID');

		$isSessionAffected = $this->clientDataContainer->logoutService()->logoutClientData($clientID);

		return $this->responseFormatter->success(['isSessionAffected' => $isSessionAffected]);
	}

	public function sboLogoutClientID(LogoutClientReq $request)
	{
		$clientID = $request->input('clientID');

		$isSessionAffected = $this->clientDataContainer->logoutService()->logoutClientData($clientID, null, false);

		return $this->responseFormatter->success(['isSessionAffected' => $isSessionAffected]);
	}

	public function isClientLogin(GetClientSessionReq $request)
	{
		return $this->responseFormatter->success([
			'isClientLogin' => $this->clientDataContainer->sessionService()->isClientLogin($request->clientID),
		]);
	}

	public function updateClientActivity(UpdateActivityReq $request)
	{
		$lastActivity = $this->clientDataContainer->sessionService()->setLastActivity($request->clientID, false);

		return $this->responseFormatter->success(['lastActivity' => $lastActivity]);
	}
}
