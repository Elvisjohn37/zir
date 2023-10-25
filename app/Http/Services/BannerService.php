<?php

namespace App\Http\Services;

use Config;
use App\Http\Repositories\BannerRepository;
use App\Http\Services\FrontendService;

class BannerService
{
	private $bannerRepository;
	private $frontendService;

	public function __construct(BannerRepository $bannerRepository, FrontendService $frontendService)
	{
		$this->bannerRepository = $bannerRepository;
		$this->frontendService = $frontendService;
	}

	public function getBannerConfig($type, $isMobileDevice, $isTestPlayer = false)
	{
		return [
			'bannerRso' => $this->frontendService->getRsoUrl() . '/' . Config::get('custom.banner.rsoBannerDir') . '/',
			'banners' => $this->bannerRepository->getBanners($type, $isMobileDevice, $isTestPlayer),
		];
	}
}
