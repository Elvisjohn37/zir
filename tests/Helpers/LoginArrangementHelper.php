<?php

namespace Tests\Helpers;

trait LoginArrangementHelper
{
	private function laravelFixArrangement()
	{
		$this->stubConfig(['custom.login.routeOnSuccess' => 'success']);
		$this->stubRedirectTo();
		$this->stubAuthUser();
		$this->stubAuthLoginUsingId();
	}

	private function servicesFixArrangement()
	{
		$this->stubZirconApiServiceGetLoginDetail();
		$this->stubZirconApiServiceGetMobileLoginDetail();
		$this->stubClientRepositoryCreateSession();
		$this->stubClientRepositoryCreateLoginLog();
		$this->stubClientDataContainerZirconApiService($this->mockZirconApiService());
		$this->stubClientDataContainerSessionService($this->mockSessionService());
		$this->stubClientDataContainerUserAgentHelper($this->mockUserAgentHelper());
		$this->stubClientDataContainerClientRepository($this->mockClientRepository());
		$this->stubClientConfigContainerMobileSiteService($this->mockMobileSiteService());
		$this->stubClientConfigContainerLanguageService($this->mockLanguageService());
	}

	protected function loginDefaultArrangement()
	{
		$this->laravelFixArrangement();
		$this->stubAuthCheck();

		$this->servicesFixArrangement();

		$zirconApiService = $this->mockZirconApiService();
		$clientRepository = $this->stubClientRepositoryIsAllowedLogin();
		$sessionService = $this->stubSessionServiceIsClientLogin(false);
		$userAgentHelper = $this->stubUserAgentHelperGetIp();

		$clientDataContainer = $this->stubClientDataContainerClientIpBlackList();

		$mobileSiteService = $this->stubMobileSiteServiceIsMobileSite();
		$languageService = $this->stubLanguageServiceSetFromSbo();
		$clientConfigContainer = $this->mockClientConfigContainer();

		return [
			'clientDataContainer' => $clientDataContainer,
			'clientConfigContainer' => $clientConfigContainer,
			'zirconApiService' => $zirconApiService,
			'clientRepository' => $clientRepository,
			'mobileSiteService' => $mobileSiteService,
			'sessionService' => $sessionService,
			'languageService' => $languageService,
			'userAgentHelper' => $userAgentHelper,
		];
	}

	protected function loginMobilePlatformArrangement()
	{
		$this->laravelFixArrangement();
		$this->stubAuthCheck();

		$this->servicesFixArrangement();

		$zirconApiService = $this->mockZirconApiService();
		$clientRepository = $this->stubClientRepositoryIsAllowedLogin();
		$sessionService = $this->stubSessionServiceIsClientLogin(false);
		$userAgentHelper = $this->stubUserAgentHelperGetIp();

		$clientDataContainer = $this->stubClientDataContainerClientIpBlackList();

		$mobileSiteService = $this->stubMobileSiteServiceIsMobileSite(true);
		$languageService = $this->stubLanguageServiceSetFromSbo();
		$clientConfigContainer = $this->mockClientConfigContainer();

		return [
			'clientDataContainer' => $clientDataContainer,
			'clientConfigContainer' => $clientConfigContainer,
			'zirconApiService' => $zirconApiService,
			'clientRepository' => $clientRepository,
			'mobileSiteService' => $mobileSiteService,
			'sessionService' => $sessionService,
			'languageService' => $languageService,
			'userAgentHelper' => $userAgentHelper,
		];
	}

	protected function loginIpChangesArrangement()
	{
		$this->laravelFixArrangement();
		$this->stubAuthCheck();

		$this->servicesFixArrangement();

		$zirconApiService = $this->mockZirconApiService();
		$clientRepository = $this->stubClientRepositoryIsAllowedLogin();
		$sessionService = $this->stubSessionServiceIsClientLogin(false);
		$userAgentHelper = $this->stubUserAgentHelperGetIp('10.2.2.2');

		$clientDataContainer = $this->stubClientDataContainerClientIpBlackList();

		$mobileSiteService = $this->stubMobileSiteServiceIsMobileSite();
		$languageService = $this->stubLanguageServiceSetFromSbo();
		$clientConfigContainer = $this->mockClientConfigContainer();

		return [
			'clientDataContainer' => $clientDataContainer,
			'clientConfigContainer' => $clientConfigContainer,
			'zirconApiService' => $zirconApiService,
			'clientRepository' => $clientRepository,
			'mobileSiteService' => $mobileSiteService,
			'sessionService' => $sessionService,
			'languageService' => $languageService,
			'userAgentHelper' => $userAgentHelper,
		];
	}

	protected function loginOtherDeviceArrangement()
	{
		$this->laravelFixArrangement();
		$this->stubAuthCheck();

		$this->servicesFixArrangement();

		$zirconApiService = $this->mockZirconApiService();
		$clientRepository = $this->stubClientRepositoryIsAllowedLogin();
		$sessionService = $this->stubSessionServiceIsClientLogin(true);
		$userAgentHelper = $this->stubUserAgentHelperGetIp();

		$clientDataContainer = $this->stubClientDataContainerClientIpBlackList();

		$mobileSiteService = $this->stubMobileSiteServiceIsMobileSite();
		$languageService = $this->stubLanguageServiceSetFromSbo();
		$clientConfigContainer = $this->mockClientConfigContainer();

		return [
			'clientDataContainer' => $clientDataContainer,
			'clientConfigContainer' => $clientConfigContainer,
			'zirconApiService' => $zirconApiService,
			'clientRepository' => $clientRepository,
			'mobileSiteService' => $mobileSiteService,
			'sessionService' => $sessionService,
			'languageService' => $languageService,
			'userAgentHelper' => $userAgentHelper,
		];
	}

	protected function loginIpBlackListedArrangement()
	{
		$this->laravelFixArrangement();
		$this->stubAuthCheck();

		$this->servicesFixArrangement();

		$zirconApiService = $this->mockZirconApiService();
		$clientRepository = $this->stubClientRepositoryIsAllowedLogin();
		$sessionService = $this->stubSessionServiceIsClientLogin(false);
		$userAgentHelper = $this->stubUserAgentHelperGetIp();

		$clientDataContainer = $this->stubClientDataContainerClientIpBlackList(true);

		$mobileSiteService = $this->stubMobileSiteServiceIsMobileSite();
		$languageService = $this->stubLanguageServiceSetFromSbo();
		$clientConfigContainer = $this->mockClientConfigContainer();

		return [
			'clientDataContainer' => $clientDataContainer,
			'clientConfigContainer' => $clientConfigContainer,
			'zirconApiService' => $zirconApiService,
			'clientRepository' => $clientRepository,
			'mobileSiteService' => $mobileSiteService,
			'sessionService' => $sessionService,
			'languageService' => $languageService,
			'userAgentHelper' => $userAgentHelper,
		];
	}

	protected function loginIsNotAllowedArrangement()
	{
		$this->laravelFixArrangement();
		$this->stubAuthCheck();

		$this->servicesFixArrangement();

		$zirconApiService = $this->mockZirconApiService();
		$clientRepository = $this->stubClientRepositoryIsAllowedLogin(false);
		$sessionService = $this->stubSessionServiceIsClientLogin(false);
		$userAgentHelper = $this->stubUserAgentHelperGetIp();

		$clientDataContainer = $this->stubClientDataContainerClientIpBlackList();

		$mobileSiteService = $this->stubMobileSiteServiceIsMobileSite();
		$languageService = $this->stubLanguageServiceSetFromSbo();
		$clientConfigContainer = $this->mockClientConfigContainer();

		return [
			'clientDataContainer' => $clientDataContainer,
			'clientConfigContainer' => $clientConfigContainer,
			'zirconApiService' => $zirconApiService,
			'clientRepository' => $clientRepository,
			'mobileSiteService' => $mobileSiteService,
			'sessionService' => $sessionService,
			'languageService' => $languageService,
			'userAgentHelper' => $userAgentHelper,
		];
	}

	protected function loginAuthCheckFailedArrangement()
	{
		$this->laravelFixArrangement();
		$this->stubAuthCheck(false);

		$this->servicesFixArrangement();

		$zirconApiService = $this->mockZirconApiService();
		$clientRepository = $this->stubClientRepositoryIsAllowedLogin();
		$sessionService = $this->stubSessionServiceIsClientLogin(false);
		$userAgentHelper = $this->stubUserAgentHelperGetIp();

		$clientDataContainer = $this->stubClientDataContainerClientIpBlackList();

		$mobileSiteService = $this->stubMobileSiteServiceIsMobileSite();
		$languageService = $this->stubLanguageServiceSetFromSbo();
		$clientConfigContainer = $this->mockClientConfigContainer();

		return [
			'clientDataContainer' => $clientDataContainer,
			'clientConfigContainer' => $clientConfigContainer,
			'zirconApiService' => $zirconApiService,
			'clientRepository' => $clientRepository,
			'mobileSiteService' => $mobileSiteService,
			'sessionService' => $sessionService,
			'languageService' => $languageService,
			'userAgentHelper' => $userAgentHelper,
		];
	}
}
