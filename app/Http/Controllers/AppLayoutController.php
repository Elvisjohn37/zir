<?php

namespace App\Http\Controllers;

use App\Http\Services\ResponseFormatterService;
use Config;
use Auth;
use URL;
use App\Http\Containers\LayoutConfigContainer;
use App\Helpers\UrlHelper;

class AppLayoutController extends BaseController
{
	private $responseFormatter;
	private $layoutConfigContainer;
	private $urlHelper;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		LayoutConfigContainer $layoutConfigContainer,
		UrlHelper $urlHelper
	) {
		$this->responseFormatter = $responseFormatter;
		$this->layoutConfigContainer = $layoutConfigContainer;
		$this->urlHelper = $urlHelper;
	}

	public function getMainLayoutConfig()
	{
		$sboUrl = $this->layoutConfigContainer->appRepository()->getSboUrl();
		$sboInfoCenterUrl = $this->layoutConfigContainer->appRepository()->getSboInfoCenterUrl();

		$config = [
			'sboTermsAndConditionUrl' => $sboUrl . Config::get('custom.sbo.sboTermsAndConditionPath'),
			'footerLink' => Config::get('custom.site.footerLink'),
			'lang' => $this->layoutConfigContainer->getLanguageConfig(),
			'aboutUs' => $sboInfoCenterUrl . Config::get('custom.sbo.sboAboutUsPath'),
			'contactUs' => $sboInfoCenterUrl . Config::get('custom.sbo.sboContactUsPath'),
			'privacyPolicy' => $sboInfoCenterUrl . Config::get('custom.sbo.sboPrivacyPolicyPath'),
			'responsibleGamblingPolicy' =>
				$sboInfoCenterUrl . Config::get('custom.sbo.sboResponsibleGamblingPolicyPath'),
			'help' => $sboInfoCenterUrl . Config::get('custom.sbo.sboHelpPath'),
			'isMobileSite' => $this->layoutConfigContainer->mobileSiteService()->isMobileSite(),
		];

		if (!Auth::check()) {
			$config['menuSportsBSI'] = $sboUrl . Config::get('custom.sbo.sboSportsBsiPath');
			$config['menuOpenAccount'] = $sboUrl . Config::get('custom.sbo.sboOpenAccountPath');
			$config['sboIframeLogin'] = $this->urlHelper->replaceDomain(
				Config::get('custom.sbo.sboIframeLogin'),
				URL::to('/')
			);
		}

		return $this->responseFormatter->success($config);
	}

	public function getNoLayoutConfig()
	{
		$config = [
			'lang' => $this->layoutConfigContainer->getLanguageConfig(),
			'isMobileSite' => $this->layoutConfigContainer->mobileSiteService()->isMobileSite(),
		];

		return $this->responseFormatter->success($config);
	}
}
