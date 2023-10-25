<?php

namespace App\Http\Services;

use App\Http\Repositories\AssetRepository;
use App\Http\Repositories\AppRepository;
use URL;
use Config;

class FrontendService
{
	private $assetRepository;
	private $appRepository;

	function __construct()
	{
		$this->assetRepository = new AssetRepository();
		$this->appRepository = new AppRepository();
	}

	public function getAssetEntryPoints(string $type, string $entryPoint = 'main'): array
	{
		$manifestContent = $this->assetRepository->getManifestContent($type, $entryPoint);

		if (!$manifestContent['result']) {
			throw new \UnexpectedValueException($manifestContent['message']);
		} else {
			return $manifestContent['data'];
		}
	}

	public function getAssetUrl()
	{
		if (empty(Config::get('custom.asset.dedicatedUrl'))) {
			return $this->getRsoUrl();
		} else {
			return replaceDomain(Config::get('custom.asset.dedicatedUrl'), URL::to('/'));
		}
	}

	public function getRsoUrl()
	{
		$rsoUrl = $this->appRepository->getRsoUrl();
		$hasExternalUrl = !empty($rsoUrl['externalUrl']);
		return replaceDomain($hasExternalUrl ? $rsoUrl['externalUrl'] : '', URL::to('/'));
	}
}
