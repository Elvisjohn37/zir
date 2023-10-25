<?php

namespace App\Models;
use DB;

class Transfer extends BaseModel
{
	protected $table = 'transfer';
	protected $primaryKey = 'transferID';

	public function scopeAddTransferStatementFields($query)
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

	public function scopeSelectTransferListFields($query)
	{
		return $query->addSelect(
			'transfer.timestampCreated AS dateTime',
			'transfer.amount',
			'transfer.actualCashBalance AS cashBalance',
			'transfer.actualAvailableCredit AS availableCredit',
			'transfer.actualPlayableBalance AS playableBalance',
			'transfertype.transferTypeName'
		);
	}

	public function scopeJoinTransferType($query)
	{
		$query->join('transfertype', 'transfertype.transferTypeID', 'transfer.transferTypeID');
	}
}
