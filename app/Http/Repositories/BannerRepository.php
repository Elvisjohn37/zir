<?php

namespace App\Http\Repositories;

use App\Models\Banner;
use Vinkla\Hashids\Facades\Hashids;

class BannerRepository extends BaseRepository
{
	private function getBannersQuery($types, $isMobileDevice = null, $isTestPlayer = false)
	{
		$banners = Banner::select(
			'banner.bannerImg',
			'banner.url',
			'banner.type',
			'banner.isNewTab',
			'banner.order',
			'game.isCertified',
			'game.gameID',
		)
			->leftJoin('game', 'game.gameID', 'banner.gameID')
			->bmWhereInOrEqual('banner.type', $types)
			->whereDateInterval()
			->orderBy('banner.order');

		if ($isMobileDevice) {
			$banners = $banners->isMobile();
		} else {
			$banners = $banners->isDesktop();
		}
		if ($isTestPlayer) {
			$banners = $banners->selectAllowTestPlayer();
		} else {
			$banners = $banners->selectIsPlayable();
		}

		$banners = $banners->get()->toArray();

		foreach ($banners as &$banner) {
			if (!empty($banner['gameID'])) {
				$banner['gameID'] = Hashids::encode($banner['gameID']);
			}
		}

		return $banners;
	}

	public function getBanners($type, $isMobileDevice, $isTestPlayer)
	{
		switch ($type) {
			case 'home':
				$banners = $this->getBannersQuery([2]);

				return [
					'mainBanner' => getObjectArray($banners, 'type', 2)
				];
			case 'games':
				return $this->getBannersQuery(1, $isMobileDevice, $isTestPlayer);
			default:
				return [];
		}
	}
}
