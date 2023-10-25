<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use App\Http\Controllers\AppLayoutController;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Containers\LayoutConfigContainerMock;
use Tests\Mock\Laravel\ConfigMock;
use Tests\Mock\Helpers\UrlHelperMock;
use Tests\Mock\Laravel\AuthMock;
use Tests\Mock\Laravel\UrlMock;

class AppLayoutControllerTest extends TestCase
{
	use ResponseFormatterServiceMock, LayoutConfigContainerMock, UrlHelperMock, ConfigMock, AuthMock, UrlMock;

	private function createController(
		$responseFormatterService = null,
		$layoutConfigContainer = null,
		$urlHelper = null
	) {
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockresponseFormatterService();

		$layoutConfigContainer =
			$layoutConfigContainer !== null ? $layoutConfigContainer : $this->mockLayoutConfigContainer();

		$urlHelper = $urlHelper !== null ? $urlHelper : $this->mockUrlHelper();

		return new AppLayoutController($responseFormatterService, $layoutConfigContainer, $urlHelper);
	}

	private function defautConfig()
	{
		$this->stubConfig([
			'custom.sbo.sboTermsAndConditionPath' => 'sboTermsAndConditionPath',
			'custom.site.copyRightDate' => 'copyRightDate',
			'custom.sbo.sboAboutUsPath' => 'sboAboutUsPath',
			'custom.sbo.sboContactUsPath' => 'sboContactUsPath',
			'custom.sbo.sboPrivacyPolicyPath' => 'sboPrivacyPolicyPath',
			'custom.sbo.sboResponsibleGamblingPolicyPath' => 'sboResponsibleGamblingPolicyPath',
			'custom.sbo.sboHelpPath' => 'sboHelpPath',
			'custom.sbo.sboSportsBsiPath' => 'sboSportsBsiPath',
			'custom.sbo.sboOpenAccountPath' => 'sboOpenAccountPath',
			'custom.sbo.sboIframeLogin' => 'sboIframeLogin',
		]);
	}

	public function testGetMainLayoutConfigShouldGetAllLayoutData()
	{
		$this->defautConfig();
		$this->stubAuthCheck(false);
		$this->stubUrlTo();
		$sboUrl = 'www.sbotest.com';
		$sboInfoCenterUrl = 'www.sbocenter.com';
		$languageConfig = 'languageConfig';
		$isMobileSite = 1;
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$layoutConfigContainer = $this->stubLayoutConfigContainerAppRepository([
			'getSboUrl' => $sboUrl,
			'getSboInfoCenterUrl' => $sboInfoCenterUrl,
		]);
		$this->stubLayoutConfigContainerGetLanguageConfig($languageConfig);
		$this->stubLayoutConfigContainerMobileSiteService([
			'isMobileSite' => $isMobileSite,
		]);
		$urlHelper = $this->stubUrlHelperReplaceDomain();

		$appLayoutController = $this->createController($reponseFormatterService, $layoutConfigContainer, $urlHelper);
		$mainLayoutConfig = $appLayoutController->getMainLayoutConfig();

		$this->assertEquals(
			[
				'sboTermsAndConditionUrl' => $sboUrl . 'sboTermsAndConditionPath',
				'copyRightDate' => 'copyRightDate',
				'lang' => $languageConfig,
				'aboutUs' => $sboInfoCenterUrl . 'sboAboutUsPath',
				'contactUs' => $sboInfoCenterUrl . 'sboContactUsPath',
				'privacyPolicy' => $sboInfoCenterUrl . 'sboPrivacyPolicyPath',
				'responsibleGamblingPolicy' => $sboInfoCenterUrl . 'sboResponsibleGamblingPolicyPath',
				'help' => $sboInfoCenterUrl . 'sboHelpPath',
				'isMobileSite' => $isMobileSite,
				'menuSportsBSI' => $sboUrl . 'sboSportsBsiPath',
				'menuOpenAccount' => $sboUrl . 'sboOpenAccountPath',
				'sboIframeLogin' => 'replacesboIframeLoginnew/tokenDOMAIN',
			],
			$mainLayoutConfig
		);
	}

	public function testGetMainLayoutConfigShouldGetCorrectLayoutDataWhenConfigChanges()
	{
		$this->stubConfig([
			'custom.sbo.sboTermsAndConditionPath' => 'sboTermsAndConditionPath2',
			'custom.site.copyRightDate' => 'copyRightDate2',
			'custom.sbo.sboAboutUsPath' => 'sboAboutUsPath2',
			'custom.sbo.sboContactUsPath' => 'sboContactUsPath2',
			'custom.sbo.sboPrivacyPolicyPath' => 'sboPrivacyPolicyPath2',
			'custom.sbo.sboResponsibleGamblingPolicyPath' => 'sboResponsibleGamblingPolicyPath2',
			'custom.sbo.sboHelpPath' => 'sboHelpPath2',
			'custom.sbo.sboSportsBsiPath' => 'sboSportsBsiPath2',
			'custom.sbo.sboOpenAccountPath' => 'sboOpenAccountPath2',
			'custom.sbo.sboIframeLogin' => 'sboIframeLogin2',
		]);
		$this->stubAuthCheck(false);
		$this->stubUrlTo();
		$sboUrl = 'www.sbotest2.com';
		$sboInfoCenterUrl = 'www.sbocenter2.com';
		$languageConfig = 'languageConfig2';
		$isMobileSite = 1;
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$layoutConfigContainer = $this->stubLayoutConfigContainerAppRepository([
			'getSboUrl' => $sboUrl,
			'getSboInfoCenterUrl' => $sboInfoCenterUrl,
		]);
		$this->stubLayoutConfigContainerGetLanguageConfig($languageConfig);
		$this->stubLayoutConfigContainerMobileSiteService([
			'isMobileSite' => $isMobileSite,
		]);
		$urlHelper = $this->stubUrlHelperReplaceDomain();

		$appLayoutController = $this->createController($reponseFormatterService, $layoutConfigContainer, $urlHelper);
		$mainLayoutConfig = $appLayoutController->getMainLayoutConfig();

		$this->assertEquals(
			[
				'sboTermsAndConditionUrl' => $sboUrl . 'sboTermsAndConditionPath2',
				'copyRightDate' => 'copyRightDate2',
				'lang' => $languageConfig,
				'aboutUs' => $sboInfoCenterUrl . 'sboAboutUsPath2',
				'contactUs' => $sboInfoCenterUrl . 'sboContactUsPath2',
				'privacyPolicy' => $sboInfoCenterUrl . 'sboPrivacyPolicyPath2',
				'responsibleGamblingPolicy' => $sboInfoCenterUrl . 'sboResponsibleGamblingPolicyPath2',
				'help' => $sboInfoCenterUrl . 'sboHelpPath2',
				'isMobileSite' => $isMobileSite,
				'menuSportsBSI' => $sboUrl . 'sboSportsBsiPath2',
				'menuOpenAccount' => $sboUrl . 'sboOpenAccountPath2',
				'sboIframeLogin' => 'replacesboIframeLogin2new/tokenDOMAIN',
			],
			$mainLayoutConfig
		);
	}

	public function testGetMainLayoutConfigShouldGetCorrectLayoutDataWhenLogin()
	{
		$this->defautConfig();
		$this->stubAuthCheck(true);
		$this->stubUrlTo();
		$sboUrl = 'www.sbotest.com';
		$sboInfoCenterUrl = 'www.sbocenter.com';
		$languageConfig = 'languageConfig';
		$isMobileSite = 1;
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$layoutConfigContainer = $this->stubLayoutConfigContainerAppRepository([
			'getSboUrl' => $sboUrl,
			'getSboInfoCenterUrl' => $sboInfoCenterUrl,
		]);
		$this->stubLayoutConfigContainerGetLanguageConfig($languageConfig);
		$this->stubLayoutConfigContainerMobileSiteService([
			'isMobileSite' => $isMobileSite,
		]);
		$urlHelper = $this->stubUrlHelperReplaceDomain();

		$appLayoutController = $this->createController($reponseFormatterService, $layoutConfigContainer, $urlHelper);
		$mainLayoutConfig = $appLayoutController->getMainLayoutConfig();

		$this->assertEquals(
			[
				'sboTermsAndConditionUrl' => $sboUrl . 'sboTermsAndConditionPath',
				'copyRightDate' => 'copyRightDate',
				'lang' => $languageConfig,
				'aboutUs' => $sboInfoCenterUrl . 'sboAboutUsPath',
				'contactUs' => $sboInfoCenterUrl . 'sboContactUsPath',
				'privacyPolicy' => $sboInfoCenterUrl . 'sboPrivacyPolicyPath',
				'responsibleGamblingPolicy' => $sboInfoCenterUrl . 'sboResponsibleGamblingPolicyPath',
				'help' => $sboInfoCenterUrl . 'sboHelpPath',
				'isMobileSite' => $isMobileSite,
			],
			$mainLayoutConfig
		);
	}

	public function testGetNoLayoutConfigShouldGetAllLayoutData()
	{
		$languageConfig = 'languageConfig';
		$isMobileSite = 1;
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$layoutConfigContainer = $this->stubLayoutConfigContainerGetLanguageConfig($languageConfig);
		$this->stubLayoutConfigContainerMobileSiteService([
			'isMobileSite' => $isMobileSite,
		]);

		$appLayoutController = $this->createController($reponseFormatterService, $layoutConfigContainer);
		$noLayoutConfig = $appLayoutController->getNoLayoutConfig();

		$this->assertEquals(
			[
				'lang' => $languageConfig,
				'isMobileSite' => $isMobileSite,
			],
			$noLayoutConfig
		);
	}

	public function testGetNoLayoutConfigShouldGetCorrectLayoutDataWhenConfigChanges()
	{
		$languageConfig = 'languageConfig1';
		$isMobileSite = 0;
		$reponseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$layoutConfigContainer = $this->stubLayoutConfigContainerGetLanguageConfig($languageConfig);
		$this->stubLayoutConfigContainerMobileSiteService([
			'isMobileSite' => $isMobileSite,
		]);

		$appLayoutController = $this->createController($reponseFormatterService, $layoutConfigContainer);
		$noLayoutConfig = $appLayoutController->getNoLayoutConfig();

		$this->assertEquals(
			[
				'lang' => $languageConfig,
				'isMobileSite' => $isMobileSite,
			],
			$noLayoutConfig
		);
	}
}
