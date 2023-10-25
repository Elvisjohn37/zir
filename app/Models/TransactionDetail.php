<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use DB;

class TransactionDetail extends BaseModel
{
	use HasFactory;

	protected $table = 'transactiondetail';

	public $Btransactiondetail_grouping = "CONCAT(
		CASE WHEN transactiondetail.event='V' THEN 1 ELSE 0 END,
		CASE WHEN transactiondetail.gameID = 3 
			THEN roundID 
			ELSE 
				CASE WHEN transactiondetail.gameID = 20001 
					THEN roundDetID 
					ELSE transactiondetail.transactionDetID  
				END 
			END
	)";

	public function scopeProductID($query, $productID)
	{
		return $query->where('game.productID', $productID);
	}

	public function scopeClientID($query, $clientID)
	{
		return $query->where('transactiondetail.clientID', $clientID);
	}

	public function scopeIsRunning($query)
	{
		return $query->where('transactiondetail.event', 'R');
	}

	public function scopeWinloseMemberComm($query)
	{
		return $query->addSelect(
			DB::raw(
				"SUM(CASE
                WHEN product.isCommRake = '0' THEN (transactiondetail.grossRake * playerCommRake)
                ELSE (transactiondetail.turnover * playerCommRake)
            END) AS commission"
			)
		);
	}

	public function scopeNotCurrentGameID($query, $gameID)
	{
		return $query->where('game.gameID', '!=', $gameID);
	}

	public function scopeAddBettingStatementFields($query)
	{
		return $query->addSelect(
			'transactiondetail.accountingDate AS date',
			'product.productName',

			DB::raw("
				SUM(transactiondetail.turnover) AS turnover,
				SUM(transactiondetail.grossRake) AS grossRake,
				COALESCE(SUM(transactiondetail.netWin), 0.00) as cashBalance, 
				0 as credit
				")
		);
	}

	public function scopeSelectDateTime($query, $transactionType, $isGrouped = true)
	{
		if ($transactionType == 'promotion') {
			if ($isGrouped) {
				$query->AddSelect(DB::raw('MAX(transactiondetail.timestampEnd) as dateTime'));
			} else {
				$query->AddSelect(DB::raw('transactiondetail.timestampEnd as dateTime'));
			}
		} else {
			if ($isGrouped) {
				$query->AddSelect(DB::raw('MIN(transactiondetail.timestampStart) as dateTime'));
			} else {
				$query->AddSelect(DB::raw('transactiondetail.timestampStart as dateTime'));
			}
		}
	}

	public function scopeEvent($query, $transactionType)
	{
		if ($transactionType == 'promotion') {
			$query->where('event', '=', 'P');
		} else {
			$query->where('event', '!=', 'P');
		}
		return $query->where('event', '!=', 'R');
	}

	public function scopeGroupByRound($query)
	{
		return $query
			->addSelect(
				Db::raw(
					"CONCAT(	
					CASE WHEN transactiondetail.event='V' THEN 1 ELSE 0 END,
					CASE WHEN transactiondetail.gameID = 655 
						THEN roundDetID 
						ELSE transactiondetail.transactionDetID  
					END
				) as derivedBetGrouping"
				)
			)
			->groupBy('derivedBetGrouping');
	}

	public function scopeBaggregateFields($query, $aggregate, $fields)
	{
		// build query
		$toupper_aggregate = strtoupper($aggregate);
		$select_build = '';

		foreach ($fields as $alias => $field) {
			if ($select_build != '') {
				$select_build .= ',';
			}

			if (!is_string($alias)) {
				$alias = getLastSegment($field);
			}

			$select_build .= $toupper_aggregate . '(' . $field . ') as ' . $alias;
		}

		return $query->addSelect(DB::raw($select_build));
	}

	public function scopeAddBettingListFields($query)
	{
		return $query
			->addSelect(
				DB::raw(
					"ANY_VALUE(product.productID) as productID,
					ANY_VALUE(product.productName) as productName,

					ANY_VALUE(game.gameID) as gameID,
					ANY_VALUE(game.gameName) as gameName"
				)
			)
			->defaultListFields();
	}

	public function scopeDefaultListFields($query)
	{
		return $query->addSelect(
			DB::raw(
				"ANY_VALUE(transactiondetail.transactionDetID) as transactionDetID,
			ANY_VALUE(transactiondetail.roundID) as roundID,
			ANY_VALUE(transactiondetail.roundDetID) as roundDetID,
			ANY_VALUE(transactiondetail.event) as event,
			SUM(transactiondetail.stake) AS stake, 
			SUM(transactiondetail.turnover) AS turnover, 
			SUM(transactiondetail.grossRake) AS grossRake, 
			SUM(transactiondetail.netWin) AS netwin,
			ANY_VALUE(transactiondetail.message) as message"
			)
		);
	}

	public function scopeBettingListJoin($query)
	{
		return $query
			->leftJoin(
				'transactiondetailresult',
				'transactiondetailresult.transactionDetID',
				'transactiondetail.transactionDetID'
			)
			->join('game', 'game.gameID', 'transactiondetail.gameID')
			->join('product', 'product.productID', 'game.productID');
	}

	public function scopeAddStatementType($query)
	{
		return $query->addSelect(
			DB::raw("
            ANY_VALUE(
                    CASE WHEN event='P' 
                        THEN 'Promotion'
                        ELSE 'Betting'
                    END               
            ) as transactionType")
		);
	}

	public function scopeGameProductLeftJoin($query)
	{
		return $query
			->leftJoin('game', 'game.gameID', 'transactiondetail.gameID')
			->leftJoin('product', 'product.productID', 'game.productID');
	}
}
