<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetBannerReq;
use App\Http\Services\BannerService;
use App\Http\Services\ResponseFormatterService;
use App\Http\Repositories\ClientRepository;
use Auth;

class BannerController extends BaseController
{
	private $responseFormatter;
	private $bannerService;
	private $clientRepository;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		BannerService $bannerService,
		ClientRepository $clientRepository
	) {
		$this->responseFormatter = $responseFormatter;
		$this->bannerService = $bannerService;
		$this->clientRepository = $clientRepository;
	}

	public function getBanners(GetBannerReq $request)
	{
		$type = $request->input('type');
		$isMobileDevice = $request->input('isMobileDevice');
		$isTestPlayer = false;
		if (Auth::check()) {
			$isTestPlayer = $this->clientRepository->isTestPlayer(Auth::user()->sboClientID);
		}
		return $this->responseFormatter->success(
			$this->bannerService->getBannerConfig($type, $isMobileDevice, $isTestPlayer)
		);
	}
}
