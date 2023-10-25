<?php

namespace App\Models;
use DB;
class Credit extends BaseModel
{
	protected $table = 'credit';

	public function scopeAddCreditStatementFields($query)
	{
		return $query->addSelect(
			DB::raw("
			'' as productName,
			0 as cashBalance,
			0 as grossRake,
			0 as turnover,
			0 as commission
			")
		);
	}

	public function scopeAddCreditListFields($query)
	{
		return $query->addSelect('actualPlayableBalance as playableBalance', 'timestampCreated as dateTime');
	}
}
