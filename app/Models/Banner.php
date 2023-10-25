<?php

namespace App\Models;

use DB;

class Banner extends BaseModel
{
	protected $table = 'banner';

	public function scopeWhereDateInterval($query)
	{
		return $query
			->where('banner.dateTimeStart', '<=', date('Y-m-d'))
			->where('banner.dateTimeEnd', '>=', date('Y-m-d'))
			->orWhereNull('banner.dateTimeStart')
			->orWhereNull('banner.dateTimeEnd');
	}

	public function scopeIsMobile($query)
	{
		return $query->whereIn('game.device', [1, 2])->orWhereNull('game.device');
	}

	public function scopeIsDesktop($query)
	{
		return $query->whereIn('game.device', [0, 2])->orWhereNull('game.device');
	}

	public function scopeSelectAllowTestPlayer($query)
	{
		return $query->addSelect(DB::raw('1 AS isPlayable'));
	}

	public function scopeSelectIsPlayable($query)
	{
		return $query->addSelect(DB::raw('game.isTestModeEnabled = 0 AS isPlayable'));
	}
}
