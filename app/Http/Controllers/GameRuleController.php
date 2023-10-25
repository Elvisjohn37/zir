<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetGameGuideReq;
use App\Http\Services\ResponseFormatterService;
use App\Http\Repositories\GameRepository;
use App\Http\Repositories\AppRepository;
use Config;

class GameRuleController extends BaseController
{
	private $responseFormatter;
	private $gameRepository;
	private $appRepository;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		GameRepository $gameRepository,
		AppRepository $appRepository
	) {
		$this->responseFormatter = $responseFormatter;
		$this->gameRepository = $gameRepository;
		$this->appRepository = $appRepository;
	}

	public function getGameGuide(GetGameGuideReq $request)
	{
		$gameGuideList = $this->gameRepository->getGameGuideList($request->input('lang'));
		$sboInfoCenterUrl = $this->appRepository->getSboInfoCenterUrl();
		return $this->responseFormatter->success([
			'config' => [
				'liveDealerGameLink' => $sboInfoCenterUrl . Config::get('custom.gamerules.sboLiveDealerPath'),
			],
			'gameGuideList' => $gameGuideList,
		]);
	}
}
