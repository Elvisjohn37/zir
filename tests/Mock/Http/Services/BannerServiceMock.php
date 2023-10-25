<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\BannerService;

trait BannerServiceMock
{
	private $bannerService;

	protected function mockBannerService()
	{
		if ($this->bannerService === null) {
			$this->bannerService = $this->createMock(BannerService::class);
		}

		return $this->bannerService;
	}

	protected function stubBannerServiceGetBannerConfig()
	{
		$this->mockBannerService()
			->method('getBannerConfig')
			->will(
				$this->returnCallback(function ($type) {
					return ['bannerRso' => 'www.' . $type . '.com', 'banners' => $type];
				})
			);

		return $this->bannerService;
	}
}
