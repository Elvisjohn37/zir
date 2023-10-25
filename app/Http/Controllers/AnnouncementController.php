<?php

namespace App\Http\Controllers;

use App\Http\Repositories\AnnouncementRepository;
use App\Http\Requests\AnnouncementReq;
use App\Http\Services\ResponseFormatterService;
use App\Http\Services\FrontendService;
use App\Http\Containers\EncryptionContainer;
use Auth;
use Config;

class AnnouncementController extends BaseController
{
	private $responseFormatter;
	private $announcementRepository;
	private $frontendService;
	private $encryptionContainer;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		AnnouncementRepository $announcementRepository,
		FrontendService $frontendService,
		EncryptionContainer $encryptionContainer
	) {
		$this->responseFormatter = $responseFormatter;
		$this->announcementRepository = $announcementRepository;
		$this->frontendService = $frontendService;
		$this->encryptionContainer = $encryptionContainer;
	}

	public function getAnnouncement(AnnouncementReq $request)
	{
		$viewType = $request->input('viewType');
		$clientID = Auth::check() ? Auth::user()->clientID : null;

		if ($viewType === 'playerSite') {
			if (Auth::check()) {
				$announcements = $this->announcementRepository->getAfterLoginAnnouncements($clientID);
			} else {
				$announcements = $this->announcementRepository->getBeforeLoginAnnouncements();
			}
		} else {
			$productID = $this->encryptionContainer->hashId()->encode($viewType);
			$announcements = $this->announcementRepository->getProductAnnouncements($productID, $clientID);
		}

		$response = [
			'clientID' => $this->encryptionContainer->hashId()->encode($clientID),
			'announcements' => $announcements,
		];

		return $this->responseFormatter->success(
			array_merge(
				$response,
				$request->input('showConfig')
					? [
						'config' => [
							'hideCookie' => Config::get('custom.announcements.announcementHideCookie'),
							'hideValidMin' => Config::get('custom.announcements.announcementHideValidMin'),
							'popupDurations' => Config::get('custom.announcements.announcementPopupDurations'),
							'rsoUrl' => $this->frontendService->getRsoUrl() . '/',
						],
					]
					: []
			)
		);
	}
}
