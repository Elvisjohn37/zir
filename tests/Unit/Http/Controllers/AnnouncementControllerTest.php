<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Repositories\AnnouncementRepositoryMock;
use Tests\Mock\Http\Services\FrontendServiceMock;
use Tests\Mock\Http\Containers\EncryptionContainerMock;
use App\Http\Controllers\AnnouncementController;
use App\Http\Requests\AnnouncementReq;
use Tests\Mock\Laravel\AuthMock;
use Tests\Mock\Laravel\ConfigMock;

class AnnouncementControllerTest extends TestCase
{
	use ResponseFormatterServiceMock,
		AnnouncementRepositoryMock,
		FrontendServiceMock,
		EncryptionContainerMock,
		AuthMock,
		ConfigMock;

	private function createController(
		$responseFormatterService = null,
		$announcementRepository = null,
		$frontendService = null,
		$encryptionContainer = null
	) {
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockresponseFormatterService();

		$announcementRepository =
			$announcementRepository !== null ? $announcementRepository : $this->mockAnnouncementRepository();

		$frontendService = $frontendService !== null ? $frontendService : $this->mockFrontendService();

		$encryptionContainer = $encryptionContainer !== null ? $encryptionContainer : $this->mockEncryptionContainer();

		return new AnnouncementController(
			$responseFormatterService,
			$announcementRepository,
			$frontendService,
			$encryptionContainer
		);
	}

	private function setDefaultConfig()
	{
		$this->stubConfig([
			'custom.announcements.announcementHideCookie' => 'announcementHideCookie',
			'custom.announcements.announcementHideValidMin' => 'announcementHideValidMin',
			'custom.announcements.announcementPopupDurations' => 'announcementPopupDurations',
		]);
	}

	public function testGetAnnouncementShouldGetAnnouncementData()
	{
		$this->stubAuthUserDefault();
		$this->setDefaultConfig();
		$responseFormatter = $this->stubResponseFormatterServiceSuccess();
		$announcementRepository = $this->stubAnnouncementRepositoryGetProductAnnouncements();
		$frontendService = $this->stubFrontendServiceGetRsoUrl();
		$encryptionContainer = $this->stubEncryptionContainerHashId();
		$viewType = 'product123';
		$showConfig = 1;
		$request = new AnnouncementReq(['viewType' => $viewType, 'showConfig' => $showConfig]);

		$announcementController = $this->createController(
			$responseFormatter,
			$announcementRepository,
			$frontendService,
			$encryptionContainer
		);

		$announcement = $announcementController->getAnnouncement($request);

		$this->assertEquals(
			[
				'clientID' => '123',
				'announcements' => 'product' . $viewType . 'client' . '123',
				'config' => [
					'hideCookie' => 'announcementHideCookie',
					'hideValidMin' => 'announcementHideValidMin',
					'popupDurations' => 'announcementPopupDurations',
					'rsoUrl' => 'www.rso-url.com' . '/',
				],
			],
			$announcement
		);
	}

	public function testGetAnnouncementShouldGetCorrectAnnouncementDataWhenViewTypeIsPlayerSiteAndIsGuest()
	{
		$this->stubAuthCheck(false);
		$this->setDefaultConfig();
		$responseFormatter = $this->stubResponseFormatterServiceSuccess();
		$announcementRepository = $this->stubAnnouncementRepositoryGetBeforeLoginAnnouncements();
		$frontendService = $this->stubFrontendServiceGetRsoUrl();
		$encryptionContainer = $this->stubEncryptionContainerHashId();
		$viewType = 'playerSite';
		$showConfig = 1;
		$request = new AnnouncementReq(['viewType' => $viewType, 'showConfig' => $showConfig]);

		$announcementController = $this->createController(
			$responseFormatter,
			$announcementRepository,
			$frontendService,
			$encryptionContainer
		);

		$announcement = $announcementController->getAnnouncement($request);

		$this->assertEquals(
			[
				'clientID' => null,
				'announcements' => 'beforeLoginAnnouncements',
				'config' => [
					'hideCookie' => 'announcementHideCookie',
					'hideValidMin' => 'announcementHideValidMin',
					'popupDurations' => 'announcementPopupDurations',
					'rsoUrl' => 'www.rso-url.com' . '/',
				],
			],
			$announcement
		);
	}

	public function testGetAnnouncementShouldGetCorrectAnnouncementDataWhenViewTypeIsPlayerSiteAndIsLoggedIn()
	{
		$this->stubAuthUserDefault();
		$this->setDefaultConfig();
		$responseFormatter = $this->stubResponseFormatterServiceSuccess();
		$announcementRepository = $this->stubAnnouncementRepositoryGetAfterLoginAnnouncements();
		$frontendService = $this->stubFrontendServiceGetRsoUrl();
		$encryptionContainer = $this->stubEncryptionContainerHashId();
		$viewType = 'playerSite';
		$showConfig = 1;
		$request = new AnnouncementReq(['viewType' => $viewType, 'showConfig' => $showConfig]);

		$announcementController = $this->createController(
			$responseFormatter,
			$announcementRepository,
			$frontendService,
			$encryptionContainer
		);

		$announcement = $announcementController->getAnnouncement($request);

		$this->assertEquals(
			[
				'clientID' => '123',
				'announcements' => 'afterLoginAnnouncement',
				'config' => [
					'hideCookie' => 'announcementHideCookie',
					'hideValidMin' => 'announcementHideValidMin',
					'popupDurations' => 'announcementPopupDurations',
					'rsoUrl' => 'www.rso-url.com' . '/',
				],
			],
			$announcement
		);
	}

	public function testGetAnnouncementShouldGetCorrectAnnouncementDataWhenPlayerChanges()
	{
		$this->stubAuthCheck(true);
		$this->stubAuthUser(['clientID' => '234']);
		$this->setDefaultConfig();
		$responseFormatter = $this->stubResponseFormatterServiceSuccess();
		$announcementRepository = $this->stubAnnouncementRepositoryGetProductAnnouncements();
		$frontendService = $this->stubFrontendServiceGetRsoUrl();
		$encryptionContainer = $this->stubEncryptionContainerHashId();
		$viewType = 'product123';
		$showConfig = 1;
		$request = new AnnouncementReq(['viewType' => $viewType, 'showConfig' => $showConfig]);

		$announcementController = $this->createController(
			$responseFormatter,
			$announcementRepository,
			$frontendService,
			$encryptionContainer
		);

		$announcement = $announcementController->getAnnouncement($request);

		$this->assertEquals(
			[
				'clientID' => '234',
				'announcements' => 'product' . $viewType . 'client' . '234',
				'config' => [
					'hideCookie' => 'announcementHideCookie',
					'hideValidMin' => 'announcementHideValidMin',
					'popupDurations' => 'announcementPopupDurations',
					'rsoUrl' => 'www.rso-url.com' . '/',
				],
			],
			$announcement
		);
	}

	public function testGetAnnouncementShouldGetCorrectAnnouncementDataWhenConfigChanges()
	{
		$this->stubAuthUserDefault();
		$this->stubConfig([
			'custom.announcements.announcementHideCookie' => 'announcementHideCookie2',
			'custom.announcements.announcementHideValidMin' => 'announcementHideValidMin2',
			'custom.announcements.announcementPopupDurations' => 'announcementPopupDurations2',
		]);
		$responseFormatter = $this->stubResponseFormatterServiceSuccess();
		$announcementRepository = $this->stubAnnouncementRepositoryGetProductAnnouncements();
		$frontendService = $this->stubFrontendServiceGetRsoUrl();
		$encryptionContainer = $this->stubEncryptionContainerHashId();
		$viewType = 'product123';
		$showConfig = 1;
		$request = new AnnouncementReq(['viewType' => $viewType, 'showConfig' => $showConfig]);

		$announcementController = $this->createController(
			$responseFormatter,
			$announcementRepository,
			$frontendService,
			$encryptionContainer
		);

		$announcement = $announcementController->getAnnouncement($request);

		$this->assertEquals(
			[
				'clientID' => '123',
				'announcements' => 'product' . $viewType . 'client' . '123',
				'config' => [
					'hideCookie' => 'announcementHideCookie2',
					'hideValidMin' => 'announcementHideValidMin2',
					'popupDurations' => 'announcementPopupDurations2',
					'rsoUrl' => 'www.rso-url.com' . '/',
				],
			],
			$announcement
		);
	}

	public function testGetAnnouncementShoudNotGetAnnouncementConfigDataWhenShowConfigIsDisabled()
	{
		$this->stubAuthUserDefault();
		$responseFormatter = $this->stubResponseFormatterServiceSuccess();
		$announcementRepository = $this->stubAnnouncementRepositoryGetProductAnnouncements();
		$frontendService = $this->stubFrontendServiceGetRsoUrl();
		$encryptionContainer = $this->stubEncryptionContainerHashId();
		$viewType = 'product123';
		$showConfig = 0;
		$request = new AnnouncementReq(['viewType' => $viewType, 'showConfig' => $showConfig]);

		$announcementController = $this->createController(
			$responseFormatter,
			$announcementRepository,
			$frontendService,
			$encryptionContainer
		);

		$announcement = $announcementController->getAnnouncement($request);

		$this->assertEquals(
			[
				'clientID' => '123',
				'announcements' => 'product' . $viewType . 'client' . '123',
			],
			$announcement
		);
	}
}
