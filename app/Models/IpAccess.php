<?php

namespace App\Models;

class IpAccess extends BaseModel
{
	protected $table = 'ipaccess';

	public function scopeisBlacklisted($query)
	{
		return $query->where('isWhitelist', '=', 0)->where('isEnabled', '=', 1);
	}
}
