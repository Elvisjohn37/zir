<?php

namespace App\Http\Containers;

use App\Http\Services\MobileSiteService;
use App\Http\Services\LanguageService;
use App\Http\Repositories\AppRepository;

class LayoutConfigContainer
{
	private $mobileSiteService;
	private $languageService;
	private $appRepository;

	public function __construct(
		MobileSiteService $mobileSiteService,
		LanguageService $languageService,
		AppRepository $appRepository
	) {
		$this->mobileSiteService = $mobileSiteService;
		$this->languageService = $languageService;
		$this->appRepository = $appRepository;
	}

	public function mobileSiteService()
	{
		return $this->mobileSiteService;
	}

	public function languageService()
	{
		return $this->languageService;
	}

	public function getLanguageConfig()
	{
		return $this->languageService->getLayoutConfig($this->mobileSiteService->isMobileSite());
	}

	public function appRepository()
	{
		return $this->appRepository;
	}
}
