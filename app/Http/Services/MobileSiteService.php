<?php

namespace App\Http\Services;

use Config;
use Route;
use Illuminate\Support\Facades\Redis;
use Exception;
use Auth;
use URL;
use Illuminate\Support\Str;

class MobileSiteService
{
	protected $noMobileElementRoutes = [
		'play',
		'account/transferfunds',
		'account/balance',
		'account/limitadjust',
		'account/selfexclusion',
		'betinfo/{type}',
		'error/notfound',
	];

	private $assetArray = [];

	public function isMobileSite()
	{
		return Config::get('custom.mobile.isMobile');
	}

	public function hasMobileElements()
	{
		$routeUri = Route::current()->uri();

		return $this->isMobileSite() && !in_array($routeUri, $this->noMobileElementRoutes) && Auth::check();
	}

	private function requestAssetEntryPoints()
	{
		$redisKey = Config::get('cache.prefix') . ':sboasset';

		if (Redis::exists($redisKey)) {
			$this->assetArray = json_decode(Redis::get($redisKey));
		} else {
			$sboMobileUrl = $this->getSboMobileUrl();
			$sboMobileResourceUrl =
				$sboMobileUrl . Config::get('custom.mobile.sboMobileManifestPath') . '?v=' . uniqid();

			if (Config::get('custom.mobile.sboMobileVerifySsl') !== false) {
				$assetJson = file_get_contents($sboMobileResourceUrl);
			} else {
				$assetJson = file_get_contents(
					$sboMobileResourceUrl,
					false,
					stream_context_create([
						'ssl' => [
							'verify_peer' => false,
							'verify_peer_name' => false,
							'allow_self_signed' => true,
						],
					])
				);
			}

			$decodedAssetJson = json_decode($assetJson);

			if (is_array($decodedAssetJson) && !empty($decodedAssetJson)) {
				$this->assetArray = preg_filter('/^/', $sboMobileUrl, $decodedAssetJson);

				Redis::set(
					$redisKey,
					json_encode($this->assetArray),
					'EX',
					Config::get('custom.mobile.sboMobileAssetExpiration') * 60
				);
			} else {
				throw new Exception(
					'Cannot fetch SBO mobile resources from ' . $sboMobileResourceUrl . ' with response: ' . $assetJson
				);
			}
		}
	}

	public function getAssetEntryPoints($type)
	{
		if (count($this->assetArray) <= 0) {
			$this->requestAssetEntryPoints();
		}

		return array_filter($this->assetArray, function ($asset) use ($type) {
			return Str::is('*.' . strtolower($type), $asset);
		});
	}

	public function getSboMobileUrl()
	{
		return replaceDomain(Config::get('custom.mobile.sboMobileUrl'), URL::to('/'));
	}
}
