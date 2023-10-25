<?php

namespace App\Http\Containers;

use App\Http\Services\MobileSiteService;
use App\Http\Services\LanguageService;

class ClientConfigContainer
{
	private $mobileSiteService;
	private $languageService;

	public function __construct(
		MobileSiteService $mobileSiteService,
		LanguageService $languageService,
	) {
		$this->mobileSiteService = $mobileSiteService;
		$this->languageService = $languageService;
	}

	public function mobileSiteService()
	{
		return $this->mobileSiteService;
	}

	public function languageService()
	{
		return $this->languageService;
	}
}
