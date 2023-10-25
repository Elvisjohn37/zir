<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Containers\ClientDataContainerMock;
use Tests\Mock\Http\Containers\ClientConfigContainerMock;
use App\Http\Controllers\ClientController;
use Tests\Mock\Laravel\AuthMock;
use Tests\Mock\Http\Services\ZirconApiServiceMock;
use Tests\Mock\Http\Repositories\ClientRepositoryMock;
use Tests\Mock\Http\Services\MobileSiteServiceMock;
use Tests\Mock\Http\Services\LanguageServiceMock;
use Tests\Mock\Http\Services\LogoutServiceMock;
use Tests\Mock\Http\Services\SessionServiceMock;
use Tests\Mock\Http\Requests\LoginReqMock;
use Tests\Mock\Helpers\UserAgentHelperMock;
use Tests\Mock\Laravel\SessionMock;
use Tests\Mock\Laravel\RedirectMock;
use Tests\Mock\Laravel\ConfigMock;
use UnexpectedValueException;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\GameRestrictionException;
use Tests\Helpers\LoginArrangementHelper;
use Tests\Helpers\LogoutArrangementHelper;
use App\Http\Requests\LogoutClientReq;
use App\Http\Requests\GetClientSessionReq;

class ClientControllerTest extends TestCase
{
	use ResponseFormatterServiceMock,
		ClientDataContainerMock,
		ClientConfigContainerMock,
		AuthMock,
		ZirconApiServiceMock,
		ClientRepositoryMock,
		MobileSiteServiceMock,
		LogoutServiceMock,
		SessionServiceMock,
		LoginReqMock,
		LanguageServiceMock,
		UserAgentHelperMock,
		SessionMock,
		RedirectMock,
		ConfigMock,
		LoginArrangementHelper,
		LogoutArrangementHelper;

	private function createController(
		$responseFormatterService = null,
		$clientDataContainer = null,
		$clientConfigContainer = null
	) {
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockResponseFormatterService();

		$clientDataContainer = $clientDataContainer !== null ? $clientDataContainer : $this->mockClientDataContainer();

		$clientConfigContainer =
			$clientConfigContainer !== null ? $clientConfigContainer : $this->mockClientConfigContainer();

		return new ClientController($responseFormatterService, $clientDataContainer, $clientConfigContainer);
	}

	public function testGetBalanceShouldGetClientBalance()
	{
		$this->stubAuthUserDefault();
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$clientRepository = $this->stubClientRepositoryGetAccountBalance(1000);
		$clientDataContainer = $this->stubClientDataContainerClientRepository($clientRepository);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$getBalance = $clientController->getBalance();

		$this->assertEquals('123' . 1000, $getBalance);
	}

	public function testGetBalanceShouldGetCorrectClientBalanceWhenClientChanges()
	{
		$this->stubAuthUser(['clientID' => '234']);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$clientRepository = $this->stubClientRepositoryGetAccountBalance(1000);
		$clientDataContainer = $this->stubClientDataContainerClientRepository($clientRepository);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$getBalance = $clientController->getBalance();

		$this->assertEquals('234' . 1000, $getBalance);
	}

	public function testGetBalanceShouldThrowErrorWhenClientBalanceIsNotFound()
	{
		$this->stubAuthUserDefault();
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$clientRepository = $this->stubClientRepositoryGetAccountBalance(null);
		$clientDataContainer = $this->stubClientDataContainerClientRepository($clientRepository);

		$this->expectException(UnexpectedValueException::class);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$clientController->getBalance();
	}

	public function testLoginShouldGetLoginDetail()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['zirconApiService']
			->expects($this->once())
			->method('getLoginDetail')
			->with($loginReq->token);

		$clientController->login($loginReq);
	}

	public function testLoginShouldGetCorrectLoginDetailWhenSitePlatformIsMobile()
	{
		$arrange = $this->loginMobilePlatformArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->id = '123';
		$loginReq->lang = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['zirconApiService']
			->expects($this->once())
			->method('getMobileLoginDetail')
			->with($loginReq->id);

		$clientController->login($loginReq);
	}

	public function testLoginShouldLogoutExistingSession()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$this->stubClientDataContainerLogoutService($logoutService);
		$loginReq->token = '123';
		$loginReq->language = 'en';
		$existingUser = '123';

		$this->authLoginUser($existingUser);
		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$logoutService
			->expects($this->once())
			->method('logoutClientData')
			->with($this->authGetUser($existingUser)->clientID, null, false);

		$clientController->login($loginReq);
	}

	public function testLoginShouldLogoutCorrectExistingSessionWhenExistingSessionChanges()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$this->stubClientDataContainerLogoutService($logoutService);
		$loginReq->token = '123';
		$loginReq->language = 'en';
		$existingUser = '234';

		$this->authLoginUser($existingUser);
		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$logoutService
			->expects($this->once())
			->method('logoutClientData')
			->with($this->authGetUser($existingUser)->clientID, null, false);

		$clientController->login($loginReq);
	}

	public function testLoginShouldNotCallToLogoutExistingSessionWhenNoExistingSession()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$this->stubClientDataContainerLogoutService($logoutService);
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$logoutService->expects($this->never())->method('logoutClientData');

		$clientController->login($loginReq);
	}

	public function testLoginShouldLogoutSessionInOtherDevice()
	{
		$arrange = $this->loginOtherDeviceArrangement();
		$loginReq = $this->mockLoginReq();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$this->stubClientDataContainerLogoutService($logoutService);
		$loginReq->token = '123';
		$loginReq->language = 'en';
		$loginDetail = $this->ziconApiServiceGetLoginDetail($loginReq->token);

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$logoutService
			->expects($this->once())
			->method('logoutClientData')
			->with($loginDetail['clientID'], null, false);

		$clientController->login($loginReq);
	}

	public function testLoginShouldLogoutCorrectSessionInOtherDeviceWhenClientChanges()
	{
		$arrange = $this->loginOtherDeviceArrangement();
		$loginReq = $this->mockLoginReq();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$this->stubClientDataContainerLogoutService($logoutService);
		$loginReq->token = '234';
		$loginReq->language = 'en';
		$loginDetail = $this->ziconApiServiceGetLoginDetail($loginReq->token);

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$logoutService
			->expects($this->once())
			->method('logoutClientData')
			->with($loginDetail['clientID'], null, false);

		$clientController->login($loginReq);
	}

	public function testLoginShouldNotCallToLogoutSessionInOtherDeviceWhenClientIsNotLogin()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$this->stubClientDataContainerLogoutService($logoutService);
		$loginReq->token = '234';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$logoutService->expects($this->never())->method('logoutClientData');

		$clientController->login($loginReq);
	}

	public function testLoginShouldSetCurrentLanguage()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';
		$loginDetail = $this->ziconApiServiceGetLoginDetail($loginReq->token);

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['languageService']
			->expects($this->once())
			->method('setFromSbo')
			->with($loginDetail['language']);

		$clientController->login($loginReq);
	}

	public function testLoginShouldNotSetCurrentLanguageWhenSitePlatformIsMobile()
	{
		$arrange = $this->loginMobilePlatformArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->id = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['languageService']->expects($this->never())->method('setFromSbo');

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateDbSession()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['clientRepository']
			->expects($this->once())
			->method('createSession')
			->with('123', '10.2.2.1');

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateCorrectDbSessionWhenClientChanges()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '234';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['clientRepository']
			->expects($this->once())
			->method('createSession')
			->with('234', '10.2.2.1');

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateCorrectDbSessionWhenIpChanges()
	{
		$arrange = $this->loginIpChangesArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['clientRepository']
			->expects($this->once())
			->method('createSession')
			->with('123', '10.2.2.2');

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateLoginLog()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['clientRepository']
			->expects($this->once())
			->method('createLoginLog')
			->with($this->authGetUser('123')->username, '10.2.2.1');

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateCorrectLoginLogWhenClientChanges()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '234';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['clientRepository']
			->expects($this->once())
			->method('createLoginLog')
			->with($this->authGetUser('234')->username, '10.2.2.1');

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateCorrectLoginLogWhenIpChanges()
	{
		$arrange = $this->loginIpChangesArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['clientRepository']
			->expects($this->once())
			->method('createLoginLog')
			->with($this->authGetUser('123')->username, '10.2.2.2');

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateAppSession()
	{
		$sessionId = 'samplejER7DycYw7TxlqA6sxEvhrzf67dQ6AAttz';
		$this->stubSessionGetId($sessionId);
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';
		$loginDetails = $this->ziconApiServiceGetLoginDetail($loginReq->token);
		$loginDetails['sboSessionID'] = $loginDetails['sessionID'];
		$loginDetails['sessionID'] = $sessionId;

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['sessionService']
			->expects($this->once())
			->method('setLoginSessions')
			->with($loginDetails);

		$clientController->login($loginReq);
	}

	public function testLoginShouldCreateCorrectAppSessionWhenClientChanges()
	{
		$sessionId = 'samplejER7DycYw7TxlqA6sxEvhrzf67dQ6AAttz';
		$this->stubSessionGetId($sessionId);
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '234';
		$loginReq->language = 'en';
		$loginDetails = $this->ziconApiServiceGetLoginDetail($loginReq->token);
		$loginDetails['sboSessionID'] = $loginDetails['sessionID'];
		$loginDetails['sessionID'] = $sessionId;

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$arrange['sessionService']
			->expects($this->once())
			->method('setLoginSessions')
			->with($loginDetails);

		$clientController->login($loginReq);
	}

	public function testLoginShouldRedirectToAfterLoginPage()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$login = $clientController->login($loginReq);

		$this->assertEquals('redirecttosuccess', $login);
	}

	public function testLoginShouldRedirectToCorrectAfterLoginPageWhenConfigChanges()
	{
		$arrange = $this->loginDefaultArrangement();
		$this->stubConfig(['custom.login.routeOnSuccess' => 'games']);
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$login = $clientController->login($loginReq);

		$this->assertEquals('redirecttogames', $login);
	}

	public function testLoginShouldThrowErrorWhenIpIsBlackListed()
	{
		$arrange = $this->loginIpBlackListedArrangement();
		$this->stubConfig(['custom.login.routeOnSuccess' => 'games']);
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$this->expectException(UnauthorizedException::class);
		$clientController->login($loginReq);
	}

	public function testLoginShouldThrowErrorWhenApiFailsToGetClientDetail()
	{
		$arrange = $this->loginDefaultArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '345';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$this->expectException(UnauthorizedException::class);
		$clientController->login($loginReq);
	}

	public function testLoginShouldThrowErrorWhenClientStatusIsNotAllowed()
	{
		$arrange = $this->loginIsNotAllowedArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$this->expectException(GameRestrictionException::class);
		$clientController->login($loginReq);
	}

	public function testLoginShouldThrowErrorWhenClientLoginFailed()
	{
		$arrange = $this->loginAuthCheckFailedArrangement();
		$loginReq = $this->mockLoginReq();
		$loginReq->token = '123';
		$loginReq->language = 'en';

		$clientController = $this->createController(
			null,
			$arrange['clientDataContainer'],
			$arrange['clientConfigContainer']
		);

		$this->expectException(UnauthorizedException::class);

		$clientController->login($loginReq);
	}

	public function testGetSessionShouldGetUserSessionData()
	{
		$this->stubAuthCheck(false);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();

		$clientController = $this->createController($responseFormatterService);
		$getSession = $clientController->getSession();

		$this->assertEquals(['isLogin' => false], $getSession);
	}

	public function testGetSessionShouldGetCorrectUserSessionDataWhenLogin()
	{
		$clientID = '123';
		$this->stubAuthCheck();
		$this->stubAuthUser();
		$this->authLoginUser('123');
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$clientRepository = $this->stubClientRepositoryGetClientLoginDetails();
		$clientDataContainer = $this->stubClientDataContainerClientRepository($clientRepository);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$getSession = $clientController->getSession();

		$this->assertEquals(['isLogin' => true, 'user' => $clientID], $getSession);
	}

	public function testGetSessionShouldGetCorrectUserSessionDataWhenClientChanges()
	{
		$clientID = '234';
		$this->stubAuthCheck();
		$this->stubAuthUser();
		$this->authLoginUser('234');
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$clientRepository = $this->stubClientRepositoryGetClientLoginDetails();
		$clientDataContainer = $this->stubClientDataContainerClientRepository($clientRepository);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$getSession = $clientController->getSession();

		$this->assertEquals(['isLogin' => true, 'user' => $clientID], $getSession);
	}

	public function testLogoutShouldLogoutClientFromDbAndThirdParties()
	{
		$arrange = $this->logoutDefaultArrangement();

		$arrange['logoutService']
			->expects($this->once())
			->method('logoutClientData')
			->with('123');

		$clientController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['clientDataContainer']
		);
		$clientController->logout();
	}

	public function testLogoutShouldNotLogoutCorrectFromDbAndThirdPartiesWhenUserChanges()
	{
		$arrange = $this->logoutClientChangeArrangement();

		$arrange['logoutService']
			->expects($this->once())
			->method('logoutClientData')
			->with('234');

		$clientController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['clientDataContainer']
		);
		$clientController->logout();
	}

	public function testLogoutShouldNotLogoutClientFromDbAndThirdPartiesWhenNoUserIsLogin()
	{
		$arrange = $this->logoutFixArrangement();

		$arrange['logoutService']->expects($this->never())->method('logoutClientData');

		$clientController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['clientDataContainer']
		);
		$clientController->logout();
	}

	public function testLogoutShouldLogoutAppSessions()
	{
		$arrange = $this->logoutDefaultArrangement();

		$arrange['sessionService']->expects($this->once())->method('logoutOwnSessions');

		$clientController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['clientDataContainer']
		);
		$clientController->logout();
	}

	public function testLogoutShouldNotLogoutAppSessionsWhenNoUserIsLogin()
	{
		$arrange = $this->logoutFixArrangement();

		$arrange['sessionService']->expects($this->never())->method('logoutOwnSessions');

		$clientController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['clientDataContainer']
		);
		$clientController->logout();
	}

	public function testInActivePlayersShouldLogoutInactivePlayers()
	{
		$this->stubConfig(['custom.login.inActive' => 30]);
		$sessionService = $this->stubSessionServiceGetAllLoginClientID();
		$clientRepository = $this->stubClientRepositoryGetInactiveClientID();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);
		$this->stubClientDataContainerClientRepository($clientRepository);
		$this->stubClientDataContainerLogoutService($logoutService);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$inactivePlayers = $clientController->inActivePlayers();

		$this->assertEquals(['affected' => 3], $inactivePlayers);
	}

	public function testInActivePlayersShouldLogoutCorrectInactivePlayersWhenInactivityConfigChanges()
	{
		$this->stubConfig(['custom.login.inActive' => 35]);
		$sessionService = $this->stubSessionServiceGetAllLoginClientID();
		$clientRepository = $this->stubClientRepositoryGetInactiveClientID();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);
		$this->stubClientDataContainerClientRepository($clientRepository);
		$this->stubClientDataContainerLogoutService($logoutService);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$inactivePlayers = $clientController->inActivePlayers();

		$this->assertEquals(['affected' => 2], $inactivePlayers);
	}

	public function testLogoutAllShouldLogoutAllClientFromDBAndThirdParties()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$sessionService = $this->stubSessionServiceGetAllLoginClientID();
		$this->stubSessionServiceLogoutAllSessions();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);
		$this->stubClientDataContainerLogoutService($logoutService);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$logoutAll = $clientController->logoutAll();

		$this->assertEquals(
			[
				'affectedSessions' => 4,
			],
			$logoutAll
		);
	}

	public function testLogoutAllShouldNotCallToLogoutAllClientFromDBAndThirdPartiesWhenNoClientIsLogin()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$sessionService = $this->stubSessionServiceGetAllLoginClientID([]);
		$this->stubSessionServiceLogoutAllSessions();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);
		$this->stubClientDataContainerLogoutService($logoutService);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$logoutAll = $clientController->logoutAll();

		$this->assertEquals(
			[
				'affectedSessions' => 0,
			],
			$logoutAll
		);
	}

	public function testLogoutAllShouldLogoutAllClientAppSession()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$sessionService = $this->stubSessionServiceGetAllLoginClientID();
		$this->stubSessionServiceLogoutAllSessions();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);
		$this->stubClientDataContainerLogoutService($logoutService);

		$sessionService->expects($this->once())->method('logoutAllSessions');

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$clientController->logoutAll();
	}

	public function testLogoutAllShouldNotCallToLogoutAllClientAppSessionWhenNoClientIsLogin()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$sessionService = $this->stubSessionServiceGetAllLoginClientID([]);
		$this->stubSessionServiceLogoutAllSessions();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);
		$this->stubClientDataContainerLogoutService($logoutService);

		$sessionService->expects($this->never())->method('logoutAllSessions');

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$clientController->logoutAll();
	}

	public function testLogoutClientIdShouldLogoutClient()
	{
		$clientID = '123';
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerLogoutService($logoutService);

		$logoutService
			->expects($this->once())
			->method('logoutClientData')
			->with($clientID);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$clientController->logoutClientID(new LogoutClientReq(['clientID' => $clientID]));
	}

	public function testLogoutClientIdShouldLogoutCorrectClientWhenClientIdChanges()
	{
		$clientID = '234';
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$logoutService = $this->stubLogoutServiceLogoutClientData();
		$clientDataContainer = $this->stubClientDataContainerLogoutService($logoutService);

		$logoutService
			->expects($this->once())
			->method('logoutClientData')
			->with($clientID);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$clientController->logoutClientID(new LogoutClientReq(['clientID' => $clientID]));
	}

	public function testIsClientLoginShouldGetClientLoginStatus()
	{
		$clientID = '123';
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$sessionService = $this->stubSessionServiceIsClientLogin();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$isClientLogin = $clientController->isClientLogin(new GetClientSessionReq(['clientID' => $clientID]));

		$this->assertEquals(
			[
				'isClientLogin' => true,
			],
			$isClientLogin
		);
	}

	public function testIsClientLoginShouldGetCorrectClientLoginStatusWhenClientIdChanges()
	{
		$clientID = '789';
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$sessionService = $this->stubSessionServiceIsClientLogin();
		$clientDataContainer = $this->stubClientDataContainerSessionService($sessionService);

		$clientController = $this->createController($responseFormatterService, $clientDataContainer);
		$isClientLogin = $clientController->isClientLogin(new GetClientSessionReq(['clientID' => $clientID]));

		$this->assertEquals(
			[
				'isClientLogin' => false,
			],
			$isClientLogin
		);
	}
}
