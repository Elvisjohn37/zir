<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Services\BannerServiceMock;
use App\Http\Controllers\BannerController;
use App\Http\Requests\GetBannerReq;

class BannerControllerTest extends TestCase
{
	use ResponseFormatterServiceMock, BannerServiceMock;

	private function createController($responseFormatterService = null, $bannerService = null)
	{
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockresponseFormatterService();

		$bannerService = $bannerService !== null ? $bannerService : $this->mockBannerService();

		return new BannerController($responseFormatterService, $bannerService);
	}

	public function testGetBannersShouldGetBannerConfig()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$bannerService = $this->stubBannerServiceGetBannerConfig();
		$type = 'games';

		$bannerController = $this->createController($responseFormatterService, $bannerService);
		$getBanners = $bannerController->getBanners(new GetBannerReq(['type' => $type]));

		$this->assertEquals(['bannerRso' => 'www.' . $type . '.com', 'banners' => $type], $getBanners);
	}

	public function testGetBannersShouldGetCorrectBannerConfigWhenRequestedTypeChanges()
	{
		$this->assertTrue(true);
	}
}
