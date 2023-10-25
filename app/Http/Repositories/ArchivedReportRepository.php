<?php

namespace App\Http\Repositories;

use DB;

class ArchivedReportRepository extends BaseRepository
{
	private $connectionName;

	public function connectJurisdiction($jurisdictionID)
	{
		if ($jurisdictionID === 2) {
			$this->connectionName = 'sqliom';
			return true;
		} elseif ($jurisdictionID === 1) {
			$this->connectionName = 'sqlmnl';
			return true;
		} else {
			return false;
		}
	}

	public function connect()
	{
		return DB::connection($this->connectionName);
	}

	function getJurisdictionDateRange($dateTimeRange)
	{
		$startDate = $dateTimeRange['startDate'];
		$endDate = $dateTimeRange['endDate'];
		if ($this->connectionName === 'sqliom') {
			return [DB::raw("DATEADD(hour, 8, '$startDate')"), DB::raw("DATEADD(hour, 8, '$endDate')")];
		} else {
			return [$dateTimeRange['startDate'], $dateTimeRange['endDate']];
		}
	}

	function getArcFinLedReportFirst($connect, $dateTimeRange, $fireClientID)
	{
		return $connect
			->table('dbo.CASHIN')
			->select(
				'C.CLIENTID AS ClientId',
				'C.CLIENTUSERNAME AS ClientUserName',
				'CASHIN.CASHINID AS EventId',
				'CASHIN.CASHINVERIFIEDTIME AS EventTime',
				DB::raw("    
                case WHEN (C.CLIENTISREP=0) AND CASHIN.CASHINMETHOD='RepTransfer' 
                    THEN 'From Rep' 
                WHEN (C.CLIENTISREP=1) AND CASHIN.CASHINMETHOD='RepTransfer' 
                    THEN 'From Player' 
                WHEN (C.CLIENTISREP=1) AND CASHIN.CASHINMETHOD='MasterRepTransfer' 
                    THEN 'From MasterRep' 
                WHEN (C.CLIENTISREP=2) AND CASHIN.CASHINMETHOD='MasterRepTransfer' 
                    THEN 'From Rep' 
                ELSE 'DEPOSIT' END
                AS Event
            "),
				DB::raw('null as Detail'),
				'CASHIN.CASHINMETHOD AS Game',
				DB::raw('null AS Debit'),
				'CASHIN.CASHINAMOUNT AS Credit',
				DB::raw('null AS Balance'),
				DB::raw('CASHIN.CASHINACCPOST + CASHIN.CASHINMETHODFEE AS AccountBalance'),
				'CASHIN.CASHINACCPRIOR AS AccountBalancePrior',
				DB::raw('null as Ver')
			)
			->join('CLIENT AS C', 'C.CLIENTID', 'CASHIN.CASHINCLIENTID')
			->join('CLIENT AS CREP', 'CREP.CLIENTID', 'C.Clientrepid')
			->where('C.CLIENTID', $fireClientID)
			->where('CASHIN.CASHINSTATUS', 1)
			->whereBetween('CASHIN.CashInTime', $this->getJurisdictionDateRange($dateTimeRange));
	}

	function getArcFinLedReportSecond($connect, $dateTimeRange, $fireClientID)
	{
		return $connect
			->table('dbo.CASHIN')
			->select(
				'C.ClientId AS ClientId',
				'C.ClientUsername AS ClientUserName',
				'CashInId AS EventId',
				'CashInVerifiedTime AS EventTime',
				DB::raw("'DEPOSIT FEE' AS Event"),
				DB::raw('null as Detail'),
				'CashInMethod AS Game',
				'CashInMethodFee AS Debit',
				DB::raw('null as Credit'),
				DB::raw('null as Balance'),
				'CashInAccPost AS AccountBalance',
				'CashInAccPrior AS AccountBalancePrior',
				DB::raw('null as Ver')
			)
			->join('CLIENT AS C', 'C.CLIENTID', 'CASHIN.CASHINCLIENTID')
			->join('CLIENT AS CREP', 'CREP.CLIENTID', 'C.Clientrepid')
			->where('C.CLIENTID', $fireClientID)
			->where('CASHIN.CASHINSTATUS', 1)
			->whereBetween('CASHIN.CashInTime', $this->getJurisdictionDateRange($dateTimeRange));
	}

	function getArcFinLedReportThird($connect, $dateTimeRange, $fireClientID)
	{
		return $connect
			->table('dbo.CASHOUT')
			->select(
				'C.ClientId AS ClientId',
				'C.ClientUsername AS ClientUserName',
				'CashOutId AS EventId',
				'CashOutTime AS EventTime',
				DB::raw("    
                case WHEN (C.CLIENTISREP=0) AND CashOutMethod='RepTransfer' 
                    THEN 'To Rep' 
                WHEN (C.CLIENTISREP=1) AND CashOutMethod='RepTransfer' 
                    THEN 'To Player' 
                WHEN (C.CLIENTISREP=1) AND CashOutMethod='MasterRepTransfer' 
                    THEN 'To MasterRep' 
                WHEN (C.CLIENTISREP=2) AND CashOutMethod='MasterRepTransfer' 
                    THEN 'To Rep' 
                ELSE 'CASHOUT' END
                AS Event
            "),
				DB::raw('null AS Detail'),
				'CASHOUT.CashOutMethod AS Game',
				'CASHOUT.CashOutAmount  AS Debit',
				DB::raw('null AS Credit'),
				DB::raw('null AS Balance'),
				DB::raw('CASHOUT.CashOutAccPost + CASHOUT.CashOutMethodFee AS AccountBalance'),
				'CASHOUT.CashOutAccPrior AS AccountBalancePrior',
				DB::raw('null AS Ver')
			)
			->join('CLIENT AS C', 'C.CLIENTID', 'CASHOUT.CashOutClientID')
			->join('CLIENT AS CREP', 'CREP.CLIENTID', 'C.Clientrepid')
			->where('C.CLIENTID', $fireClientID)
			->whereBetween('CASHOUT.CashOutTime', $this->getJurisdictionDateRange($dateTimeRange));
	}

	function getArcFinLedReportFourth($connect, $dateTimeRange, $fireClientID)
	{
		return $connect
			->table('dbo.CASHOUT')
			->select(
				'C.ClientId AS ClientId',
				'C.ClientUsername AS ClientUserName',
				'CashOutId AS EventId',
				'CashOutTime AS EventTime',
				DB::raw("'CASHOUT FEE' AS Event"),
				DB::raw('null AS Detail'),
				'CashOutMethod AS Game',
				'CashOutMethodFee AS Debit',
				DB::raw('NULL AS Credit'),
				DB::raw('NULL AS Balance'),
				'CashOutAccPost AS AccountBalance',
				'CashOutAccPrior AS AccountBalancePrior',
				DB::raw('NULL AS Ver')
			)
			->join('CLIENT AS C', 'C.CLIENTID', 'CASHOUT.CashOutClientID')
			->join('CLIENT AS CREP', 'CREP.CLIENTID', 'C.Clientrepid')
			->where('C.CLIENTID', $fireClientID)
			->whereBetween('CASHOUT.CashOutTime', $this->getJurisdictionDateRange($dateTimeRange));
	}

	function getArcFinLedReportFifth($connect, $dateTimeRange, $fireClientID)
	{
		return $connect
			->table('dbo.ADJUSTMENT')
			->select(
				'C.ClientId AS ClientId',
				'C.ClientUsername AS ClientUserName',
				'ADJUSTMENT.AdjustmentId AS EventId',
				'ADJUSTMENT.AdjustmentTime AS EventTime',
				DB::raw("'ADJUSTMENT' AS Event"),
				DB::raw("'' AS Detail"),
				'ADJUSTMENT.AdjustmentReason AS Game',
				DB::raw('-AdjustmentAmount AS Debit'),
				DB::raw('null AS Credit'),
				DB::raw('null AS Balance'),
				'ADJUSTMENT.AdjustmentAccPost AS AccountBalance',
				'ADJUSTMENT.AdjustmentAccPrior AS AccountBalancePrior',
				DB::raw('null AS Ver')
			)
			->join('CLIENT AS C', 'C.CLIENTID', 'ADJUSTMENT.AdjustmentClientID')
			->join('CLIENT AS CREP', 'CREP.CLIENTID', 'C.Clientrepid')
			->where('C.CLIENTID', $fireClientID)
			->where('ADJUSTMENT.AdjustmentAmount', 0)
			->whereBetween('ADJUSTMENT.AdjustmentTime', $this->getJurisdictionDateRange($dateTimeRange));
	}

	function getArcFinLedReportSix($connect, $dateTimeRange, $fireClientID)
	{
		return $connect
			->table('dbo.ADJUSTMENT')
			->select(
				'C.ClientId AS ClientId',
				'C.ClientUsername AS ClientUserName',
				'ADJUSTMENT.AdjustmentId AS EventId',
				'ADJUSTMENT.AdjustmentTime AS EventTime',
				DB::raw("'ADJUSTMENT' AS Event"),
				DB::raw("'' AS Detail"),
				'ADJUSTMENT.AdjustmentReason AS Game',
				DB::raw('null AS Debit'),
				DB::raw('AdjustmentAmount AS Credit'),
				DB::raw('null AS Balance'),
				'ADJUSTMENT.AdjustmentAccPost AS AccountBalance',
				'ADJUSTMENT.AdjustmentAccPrior AS AccountBalancePrior',
				DB::raw('null AS Ver')
			)
			->join('CLIENT AS C', 'C.CLIENTID', 'ADJUSTMENT.AdjustmentClientID')
			->join('CLIENT AS CREP', 'CREP.CLIENTID', 'C.Clientrepid')
			->where('C.CLIENTID', $fireClientID)
			->where('ADJUSTMENT.AdjustmentStatus', 1)
			->where('ADJUSTMENT.AdjustmentAmount', 0)
			->whereBetween('ADJUSTMENT.AdjustmentTime', $this->getJurisdictionDateRange($dateTimeRange));
	}

	function getArcFinLedReportSeven($connect, $dateTimeRange, $fireClientID)
	{
		return $connect
			->table('dbo.SESSION')
			->select(
				'C.ClientId AS ClientId',
				'C.ClientUsername AS ClientUserName',
				'SESSION.SessionClientId AS EventId',
				'SESSION.SessionEnd AS EventTime',
				DB::raw("'SESSION' AS Event"),
				DB::raw("'' AS Detail"),
				'GT.GameTableName  AS Game',
				DB::raw("
                    CASE WHEN SESSION.SESSIONMONEYBET >= SESSION.SESSIONMONEYWON
                        THEN SESSION.SESSIONMONEYBET - SESSION.SESSIONMONEYWON
                    ELSE 0
                    END AS Debit
                "),
				DB::raw("
                    CASE WHEN SESSION.SESSIONMONEYWON >= SESSION.SESSIONMONEYBET
                        THEN SESSION.SESSIONMONEYWON - SESSION.SESSIONMONEYBET
                    ELSE 0
                    END AS Credit
                "),
				DB::raw('null AS Balance'),
				'SessionCreditAtEnd AS AccountBalance',
				DB::raw('SESSION.SessionCreditAtStart + SESSION.SessionCreditAtStart AS AccountBalancePrior'),
				'GT.GameTableVersion AS Ver'
			)
			->join('GameTable AS GT', 'GT.GameTableID', 'SESSION.SessionGameTableID')
			->join('CLIENT AS C', 'C.CLIENTID', 'SESSION.SessionClientID')
			->join('CLIENT AS CREP', 'CREP.CLIENTID', 'C.Clientrepid')
			->where('C.CLIENTID', $fireClientID)
			->whereBetween('SESSION.SessionEnd', $this->getJurisdictionDateRange($dateTimeRange));
	}

	function getArcFinLedReport($pageLimitOffset, $dateTimeRange, $fireClientID)
	{
		$connect = $this->connect();
		$result = $this->getArcFinLedReportFirst($connect, $dateTimeRange, $fireClientID)
			->union($this->getArcFinLedReportSecond($connect, $dateTimeRange, $fireClientID))
			->union($this->getArcFinLedReportThird($connect, $dateTimeRange, $fireClientID))
			->union($this->getArcFinLedReportFourth($connect, $dateTimeRange, $fireClientID))
			->union($this->getArcFinLedReportFifth($connect, $dateTimeRange, $fireClientID))
			->union($this->getArcFinLedReportSix($connect, $dateTimeRange, $fireClientID))
			->union($this->getArcFinLedReportSeven($connect, $dateTimeRange, $fireClientID));

		$result = $result->get()->toArray();
		$totalRow = count($result);

		if ($totalRow > 0) {
			$tempTableName = 'financialledger';
			$this->financialLedgerTempTable($result, $tempTableName);

			return [
				'content' => DB::table($tempTableName)
					->offset($pageLimitOffset['offset'])
					->limit($pageLimitOffset['limit'])
					->orderBy('eventTime', 'desc')
					->get()
					->toArray(),
				'totalRow' => $totalRow,
			];
		} else {
			return [
				'content' => [],
				'totalRow' => $totalRow,
			];
		}
	}

	private function financialLedgerTempTable($gameLedgerData, $tempTableName)
	{
		DB::statement(
			"CREATE TEMPORARY TABLE {$tempTableName}
            (ClientId INTEGER(6),
            ClientUserName VARCHAR(50),
            EventId INTEGER(6),
            EventTime DATETIME(6),
            Event VARCHAR(50),
            Detail VARCHAR(200),
            Game VARCHAR(200),
            Debit DECIMAL(19,6),
			Credit DECIMAL(19,6),
            Balance DECIMAL(19,6),
			AccountBalance DECIMAL(19,6),
            AccountBalancePrior DECIMAL(19,6),
            ver VARCHAR(20)
            )"
		);

		DB::table($tempTableName)->insert(json_decode(json_encode($gameLedgerData), true));
	}

	function getGameLedger($fireClientID, $dateTimeRange, $pageLimitOffset)
	{
		$result = $this->connect()
			->table('dbo.CLIENT')
			->selectRaw(
				"dbo.FUNC_GETEVENT(dbo.GAMETABLE.GAMETABLETYPE,dbo.GAMEPLAYER.GamePlayerState) event,
				dbo.FUNC_GETDETAILWITHROUNDID(dbo.GAMETABLE.GAMETABLETYPE, dbo.GAMEPLAYER.GamePlayerState, dbo.GAMEDEALER.GAMEDEALERSTATE, dbo.GAMEPLAYER.GamePlayerGlobalRoundID) detail, 
				dbo.GAMETABLE.GAMETABLENAME game, 
				dbo.FUNC_GETDEBIT(dbo.GAMETABLE.GAMETABLETYPE,dbo.GAMEPLAYER.GamePlayerState) debit,    
				dbo.FUNC_GETCREDIT(dbo.GAMETABLE.GAMETABLETYPE,dbo.GAMEPLAYER.GamePlayerState) credit,    
				dbo.FUNC_GETBALANCE(dbo.GAMETABLE.GAMETABLETYPE,dbo.GAMEPLAYER.GamePlayerState) balance,    
				CAST(DBO.FUNC_GETVALUE(dbo.GAMEPLAYER.GamePlayerState, 'credits', 1) AS MONEY)/100 AS accountbalance,    
				DBO.FUNC_GETVALUE(dbo.GAMEPLAYER.GamePlayerState, 'ver', 1) ver,    
				dbo.FUNC_GETWEBLINK(dbo.GAMETABLE.GAMETABLETYPE,dbo.GAMEPLAYER.GamePlayerState, dbo.LANGUAGECODES.languageurl) weblink"
			)
			->join('dbo.GAMEPLAYER', 'dbo.GAMEPLAYER.GamePlayerClientID', 'dbo.CLIENT.CLIENTID')
			->join('dbo.LANGUAGECODES', 'dbo.LANGUAGECODES.LANGUAGEID', 'dbo.CLIENT.CLIENTLANGUAGEID')
			->join(
				'dbo.GAMETABLE',
				'dbo.GAMETABLE.GAMETABLEID',
				'=',
				DB::raw("CAST(DBO.FUNC_GETVALUE(dbo.GAMEPLAYER.GamePlayerState, 'table', 1) AS INT)"),
				'left outer'
			)
			->join('dbo.GAMEDEALER', 'dbo.GAMEDEALER.GameDealerID', '=', 'dbo.GAMEPLAYER.GameDealerID', 'left outer')
			->where('dbo.CLIENT.CLIENTID', '=', $fireClientID);

		if ($this->connectionName === 'sqliom') {
			$result = $result
				->whereBetween(DB::raw('DATEADD(hour, 8, dbo.GAMEPLAYER.GamePlayerStateTime)'), [
					$dateTimeRange['startDate'],
					$dateTimeRange['endDate'],
				])
				->addSelect(DB::raw('DATEADD(hour, 8, dbo.GAMEPLAYER.GamePlayerStateTime) as eventTime'));
		} else {
			$result = $result
				->whereBetween('dbo.GAMEPLAYER.GamePlayerStateTime', [
					$dateTimeRange['startDate'],
					$dateTimeRange['endDate'],
				])
				->addSelect('dbo.GAMEPLAYER.GamePlayerStateTime as eventTime');
		}

		$result = $result->get()->toArray();
		$totalRow = count($result);

		if ($totalRow > 0) {
			$tempTableName = 'gameledger';
			$this->gameLedgerTempTable($result, $tempTableName);

			return [
				'content' => DB::table($tempTableName)
					->offset($pageLimitOffset['offset'])
					->limit($pageLimitOffset['limit'])
					->orderBy('eventTime', 'desc')
					->get()
					->toArray(),
				'totalRow' => $totalRow,
			];
		} else {
			return [
				'content' => [],
				'totalRow' => $totalRow,
			];
		}
	}

	private function gameLedgerTempTable($gameLedgerData, $tempTableName)
	{
		DB::statement(
			"CREATE TEMPORARY TABLE {$tempTableName}
			(eventTime DATETIME(6),
			event VARCHAR(50),
			detail VARCHAR(200),
			game VARCHAR(100),
			debit DECIMAL(19,6),
			credit DECIMAL(19,6),
			balance DECIMAL(19,6),
			accountbalance DECIMAL(19,6),
			ver VARCHAR(20),
			weblink VARCHAR(200)
			)"
		);

		DB::table($tempTableName)->insert(json_decode(json_encode($gameLedgerData), true));
	}
}
