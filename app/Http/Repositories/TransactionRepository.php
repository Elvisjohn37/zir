<?php

namespace App\Http\Repositories;

use App\Models\TransactionDetail;
use App\Models\Transfer;
use App\Models\Credit;
use App\Models\GameConfig;
use App\Http\Services\ReportService;
use App\Http\Services\LanguageService;

use DB;
use URL;

class TransactionRepository extends BaseRepository
{
	public function getRunningBets($clientID, $pageLimitOffset)
	{
		$runningBets = TransactionDetail::select(
			DB::raw("
			ANY_VALUE(transactiondetail.transactionDetID) as transactionDetID,
			ANY_VALUE(transactiondetail.message) as message,
			ANY_VALUE(transactiondetail.event) as event,
			ANY_VALUE(transactiondetail.roundID) as roundID,
			ANY_VALUE(transactiondetail.roundDetID) as roundDetID,
			ANY_VALUE(transactiondetail.timestampStart) as dateTime,
			ANY_VALUE(transactiondetailresult.result) as result,
			ANY_VALUE(transactiondetail.clientID) as clientID,

			ANY_VALUE(product.productID) as productID,
			ANY_VALUE(product.productName) as productName,

			ANY_VALUE(game.gameID) as gameID,
			ANY_VALUE(game.gameName) as gameName,
			ANY_VALUE(transactiondetail.stake) as stake
			")
		)
			->baggregateFields('SUM', ['transactiondetail.turnover', 'transactiondetail.stake'])
			->bettingListJoin()
			->groupByRound()
			->where('transactiondetail.clientID', $clientID)
			->isRunning()
			->get();

		$runningBets = empty($runningBets) ? [] : $runningBets->toArray();
		$totalRow = count($runningBets);

		$tableName = $this->insertTempRunningBets($runningBets);
		$totalRunningBets = $this->getTotalRunningBets($clientID, $tableName);

		$reportService = new ReportService();

		$transactionBetDetails = [];

		$content = DB::table($tableName)
			->orderBy('dateTime', 'desc')
			->offset($pageLimitOffset['offset'])
			->limit($pageLimitOffset['limit'])
			->get();
		$content->toArray();

		foreach ($content as $key => $resultTransaction) {
			$reportService->addGameResultFields($transactionBetDetails[$key], $resultTransaction);
			$reportService->addGameDetailsFields($transactionBetDetails[$key], $resultTransaction);
			$reportService->addStakeTurnoverFields($transactionBetDetails[$key], $resultTransaction);
			$reportService->addToFormattedArray($transactionBetDetails[$key], $resultTransaction, 'dateTime');
		}

		return [
			'content' => $transactionBetDetails,
			'totalRunningBets' => $totalRunningBets,
			'totalRow' => $totalRow,
		];
	}

	private function insertTempRunningBets($runningBets)
	{
		$tableName = 'ziprunningbets';

		DB::statement(
			"CREATE TEMPORARY TABLE $tableName
			(runningBetID INT PRIMARY KEY AUTO_INCREMENT,
			transactionDetID BIGINT,
			roundID VARCHAR(100),
			clientID BIGINT,
			roundDetID VARCHAR(100),
			result JSON,
			`event` CHAR(1),
			`message` VARCHAR(255),
			productID INT,
			productName VARCHAR(50),
			gameID INT,
			gameName VARCHAR(50),
			`dateTime` DATETIME(6),
			stake DECIMAL(19,6),
			turnover DECIMAL(19,6),
			derivedBetGrouping VARCHAR(100))"
		);

		DB::table($tableName)->insert($runningBets);

		return $tableName;
	}

	private function getTotalRunningBets($clientID, $tableName)
	{
		return DB::table($tableName)
			->addSelect(DB::raw('SUM(stake)'))
			->where('clientID', $clientID)
			// ** CHECK-E use scopeIsRunning
			->where('event', 'R')
			->value('stake');
	}

	public function getStatement($clientID, $startDate, $endDate)
	{
		$bettingResult = $this->getStatementPromotionBetting($clientID, $startDate, $endDate);
		$transferResult = $this->getStatementTransfer($clientID, $startDate, $endDate);
		$creditResult = $this->getStatementCredit($clientID, $startDate, $endDate);

		$tableName = $this->createStatementTempTable(array_merge($bettingResult, $transferResult, $creditResult));

		$statmentTransactions = DB::table($tableName)
			->orderBy('date', 'desc')
			->get();
		$statmentTransactions->toArray();

		$content = [];
		$total = 0;
		$footer = [
			'grossRake' => 0,
			'turnover' => 0,
			'commission' => 0,
			'cashBalance' => 0,
			'credit' => 0,
		];

		$reportService = new ReportService();

		foreach ($statmentTransactions as $key => $resultTransaction) {
			# initialization
			$content[$key]['rowNo'] = ++$total;
			$content[$key]['type'] = $resultTransaction->transactionType;
			$reportService->addToFormattedArray($content[$key], $resultTransaction, 'date');
			$reportService->addProductName($content[$key], $resultTransaction);

			$reportService->addToFormattedArray($content[$key], $resultTransaction, 'turnover');
			$reportService->addToFormattedArray($content[$key], $resultTransaction, 'grossRake');
			$reportService->addToFormattedArray($content[$key], $resultTransaction, 'commission');
			$reportService->addToFormattedArray($content[$key], $resultTransaction, 'cashBalance');
			$reportService->addToFormattedArray($content[$key], $resultTransaction, 'credit');

			$reportService->addStatementFooter($footer, $resultTransaction);
		}

		return compact('content', 'footer');
	}

	private function createStatementTempTable($transactionData)
	{
		$tableName = 'zipstatement';

		DB::statement(
			"CREATE TEMPORARY TABLE $tableName (transactionID INT PRIMARY KEY AUTO_INCREMENT,`date` DATE NOT NULL, 
			productID INT  NULL DEFAULT 0,
			productName VARCHAR(50)  DEFAULT '',
			transactionType VARCHAR(10) NOT NULL DEFAULT '',
			turnover DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			grossRake DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			cashBalance DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			commission DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			credit DECIMAL(19,6) NOT NULL DEFAULT 0.000000)"
		);

		DB::table($tableName)->insert($transactionData);

		return $tableName;
	}

	private function getStatementPromotionBetting($clientID, $startDate, $endDate)
	{
		$result = TransactionDetail::select(DB::raw('ANY_VALUE(product.productID) AS productID '))
			->addBettingStatementFields()
			->winloseMemberComm()
			->addStatementType()
			->gameProductLeftJoin()
			->clientID($clientID)
			->where('event', '!=', 'R')
			->whereBetween('transactiondetail.accountingDate', [$startDate, $endDate])
			->groupBy('transactiondetail.accountingDate', 'product.productName')
			->get();

		return empty($result) ? [] : $result->toArray();
	}

	private function getStatementTransfer($clientID, $startDate, $endDate)
	{
		$result = Transfer::select(
			'transfer.accountingDate AS date',
			DB::raw('0 AS credit, 0 AS productID, 0 AS productID')
		)
			->addTransferStatementFields()
			->joinTransferType()
			->bmSelectTransactionType('transfer')
			->whereIn('transfertype.transferTypeName', ['Withdrawal', 'Deposit', 'Cutoff'])
			->where('clientID', '=', $clientID)
			->whereBetween('transfer.accountingDate', [$startDate, $endDate])
			->groupBy('transfer.accountingDate')
			->get();

		return empty($result) ? [] : $result->toArray();
	}

	private function getStatementCredit($clientID, $startDate, $endDate)
	{
		$result = Credit::select(
			'credit.accountingDate AS date',
			DB::raw('SUM(credit.amount) AS credit, 0 AS productID')
		)
			->addCreditStatementFields()
			->bmSelectTransactionType('credit')
			->where('clientID', '=', $clientID)
			->whereBetween('credit.accountingDate', [$startDate, $endDate])
			->groupBy('credit.accountingDate')
			->get();

		return empty($result) ? [] : $result->toArray();
	}

	public function getPlayerBetList($clientID, $date, $productID, $pageLimitOffset)
	{
		$transactionType = 'betting';
		$result = TransactionDetail::addBettingListFields()
			->addSelect(DB::raw('ANY_VALUE(transactiondetail.timestampEnd) as timestampEnd'))
			->selectDateTime($transactionType)
			->bmSelectTransactionType($transactionType)
			->winloseMemberComm()
			->event($transactionType)
			->bettingListJoin()
			->where('clientID', '=', $clientID)
			->where('accountingDate', '=', $date)
			->where('product.productID', '=', $productID)
			->groupByRound()
			->get();

		$result = empty($result) ? [] : $result->toArray();
		$totalRow = count($result);

		$tableName = $this->insertTempPlayerBetPromoTransaction($transactionType, $result);

		$resultTransactionDetails = DB::table($tableName)
			->offset($pageLimitOffset['offset'])
			->limit($pageLimitOffset['limit'])
			->orderBy('dateTime', 'desc')
			->get();
		$resultTransactionDetails->toArray();

		$transactionBetDetails = $this->promotionBettingListFormatter(
			$resultTransactionDetails,
			$pageLimitOffset['offset']
		);
		$product = $totalRow > 0 ? $resultTransactionDetails[0]->productName : '';
		return [
			'content' => $transactionBetDetails,
			'totalRow' => $totalRow,
			'product' => $product,
		];
	}

	public function getPlayerPromotionDetail($clientID, $date, $pageLimitOffset)
	{
		$transactionType = 'promotion';
		$result = TransactionDetail::defaultListFields()
			->selectDateTime($transactionType)
			->bmSelectTransactionType($transactionType)
			->event($transactionType)
			->groupByRound()
			->where('clientID', '=', $clientID)
			->where('accountingDate', '=', $date)
			->get();

		$result = empty($result) ? [] : $result->toArray();
		$totalRow = count($result);
		$tableName = $this->insertTempPlayerBetPromoTransaction($transactionType, $result);
		$resultTransactionDetails = DB::table($tableName)
			->offset($pageLimitOffset['offset'])
			->limit($pageLimitOffset['limit'])
			->orderBy('dateTime', 'desc')
			->get();
		$resultTransactionDetails->toArray();

		return [
			'content' => $this->promotionBettingListFormatter($resultTransactionDetails, $pageLimitOffset['offset']),
			'totalRow' => $totalRow,
			'product' => 'Promotion',
		];
	}

	private function promotionBettingListFormatter($resultTransactionDetails, $offset)
	{
		$reportService = new ReportService();
		$transactionBetDetails = [];
		foreach ($resultTransactionDetails as $key => $resultTransaction) {
			$transactionBetDetails[$key]['rowNo'] = ++$offset;

			$reportService->addGameDetailsFields($transactionBetDetails[$key], $resultTransaction, true);
			$reportService->addGameResultFields($transactionBetDetails[$key], $resultTransaction);

			$reportService->addToFormattedArray($transactionBetDetails[$key], $resultTransaction, 'dateTime');
			$reportService->addToFormattedArray($transactionBetDetails[$key], $resultTransaction, 'grossRake');

			$reportService->addStakeTurnoverFields($transactionBetDetails[$key], $resultTransaction);
			$reportService->addMembersWLCommision($transactionBetDetails[$key], $resultTransaction);
		}

		return $transactionBetDetails;
	}

	private function insertTempPlayerBetPromoTransaction($transactionType, $playerBetTransactions)
	{
		$tableName = 'zip' . $transactionType . 'list';
		DB::statement(
			"CREATE TEMPORARY TABLE $tableName
			(playerBetTransID INT PRIMARY KEY AUTO_INCREMENT,
			transactionDetID BIGINT,
			roundID VARCHAR(100),
			roundDetID VARCHAR(100),
			`event` CHAR(1),
			`message` VARCHAR(255),
			productID INT,
			transactionType VARCHAR(10),
			productName VARCHAR(50),
			gameID INT,
			gameName VARCHAR(50),
			`dateTime` DATETIME(6),
			`timestampEnd` DATETIME(6),
			commission DECIMAL(19,6),
			stake DECIMAL(19,6),
			turnover DECIMAL(19,6),
			grossRake DECIMAL(19,6),
			netwin DECIMAL(19,6),
			derivedBetGrouping VARCHAR(100))"
		);

		DB::table($tableName)->insert($playerBetTransactions);

		return $tableName;
	}

	public function getPlayerTransferList($clientID, $date, $pageLimitOffset)
	{
		$result = Transfer::selectTransferListFields()
			->joinTransferType()
			->where('accountingDate', '=', $date)
			->where('clientID', '=', $clientID)
			->get();

		$result = empty($result) ? [] : $result->toArray();
		$totalRow = count($result);

		$tableName = $this->insertTempPlayerTransferTransaction($result);

		$resultPlayerTransferDetails = DB::table($tableName)
			->offset($pageLimitOffset['offset'])
			->limit($pageLimitOffset['limit'])
			->orderBy('dateTime', 'desc')
			->get();
		$resultPlayerTransferDetails->toArray();

		$transactionTransferDetails = [];
		$reportService = new ReportService();

		foreach ($resultPlayerTransferDetails as $key => $resultTransaction) {
			$transactionTransferDetails[$key]['rowNo'] = ++$pageLimitOffset['offset'];
			$reportService->addToFormattedArray($transactionTransferDetails[$key], $resultTransaction, 'dateTime');

			$reportService->addTransferDescriptionFields($transactionTransferDetails[$key], $resultTransaction);
			$reportService->addTransferAmountFields($transactionTransferDetails[$key], $resultTransaction);
			$reportService->addOutstandingBalanceFields($transactionTransferDetails[$key], $resultTransaction);
			$reportService->addToFormattedArray(
				$transactionTransferDetails[$key],
				$resultTransaction,
				'playableBalance'
			);
		}
		return ['content' => $transactionTransferDetails, 'totalRow' => $totalRow];
	}

	private function insertTempPlayerTransferTransaction($playerTransferTransactions)
	{
		$tableName = 'ziptransferlist';

		DB::statement(
			"CREATE TEMPORARY TABLE $tableName
			(playerTransferID INT PRIMARY KEY AUTO_INCREMENT,
			transferTypeName  VARCHAR(20),
			`dateTime` DATETIME(6),
			amount DECIMAL(19,6),
			cashBalance DECIMAL(19,6),
			availableCredit DECIMAL(19,6),
			playableBalance DECIMAL(19,6)
			)"
		);
		DB::table($tableName)->insert($playerTransferTransactions);

		return $tableName;
	}

	public function getPlayerCreditList($clientID, $date, $pageLimitOffset)
	{
		$result = Credit::select('newCreditLimit as creditLimit', 'actualTotalBalance as playerTotalBalance')
			->addCreditListFields()
			->where('accountingDate', '=', $date)
			->where('clientID', '=', $clientID)
			->get();

		$result = empty($result) ? [] : $result->toArray();
		$totalRow = count($result);

		$tableName = $this->insertTempPlayerCreditTransaction($result);

		$resultPlayerCreditDetails = DB::table($tableName)
			->offset($pageLimitOffset['offset'])
			->limit($pageLimitOffset['limit'])
			->orderBy('dateTime', 'desc')
			->get();
		$resultPlayerCreditDetails->toArray();

		$transactionCreditDetails = [];
		$reportService = new ReportService();

		foreach ($resultPlayerCreditDetails as $key => $resultTransaction) {
			$reportService->addToFormattedArray($transactionCreditDetails[$key], $resultTransaction, 'dateTime');
			$reportService->addToFormattedArray($transactionCreditDetails[$key], $resultTransaction, 'creditLimit');
			$reportService->addToFormattedArray(
				$transactionCreditDetails[$key],
				$resultTransaction,
				'playerTotalBalance'
			);
			$reportService->addToFormattedArray($transactionCreditDetails[$key], $resultTransaction, 'playableBalance');
		}

		return ['content' => $transactionCreditDetails, 'totalRow' => $totalRow];
	}

	private function insertTempPlayerCreditTransaction($playerCreditTransactions)
	{
		$tableName = 'zipcreditlist';
		DB::statement(
			"CREATE TEMPORARY TABLE $tableName
			(playerCreditID INT PRIMARY KEY AUTO_INCREMENT,
			`dateTime` DATETIME(6),
			creditLimit DECIMAL(19,6),
			playerTotalBalance DECIMAL(19,6),
			playableBalance DECIMAL(19,6)
			)"
		);
		DB::table($tableName)->insert($playerCreditTransactions);
		return $tableName;
	}

	public function getTransactionLog($clientID, $dateTimeRange, $pageLimitOffset)
	{
		$totalRow = 0;

		$tableName = $this->createTransactionLogTempTable();

		$bettingLogResult = $this->transactionLogBetting($clientID, $dateTimeRange);
		$totalRow += count($bettingLogResult);
		DB::table($tableName)->insert($bettingLogResult);

		$promotionLogResult = $this->transactionLogPromotion($clientID, $dateTimeRange);
		$totalRow += count($promotionLogResult);
		DB::table($tableName)->insert($promotionLogResult);

		$creditLogResult = $this->transactionLogCredit($clientID, $dateTimeRange);
		$totalRow += count($creditLogResult);
		DB::table($tableName)->insert($creditLogResult);

		$transferLogResult = $this->transactionLogTransfer($clientID, $dateTimeRange);
		$totalRow += count($transferLogResult);
		DB::table($tableName)->insert($transferLogResult);

		$transactionLogs = DB::table($tableName)
			->offset($pageLimitOffset['offset'])
			->limit($pageLimitOffset['limit'])
			->orderBy('dateTime', 'desc')
			->get();

		$transactionLogsDetails = [];
		$reportService = new ReportService();

		foreach ($transactionLogs as $key => $resultTransaction) {
			$transactionLogsDetails[$key]['rowNo'] = ++$pageLimitOffset['offset'];
			switch ($resultTransaction->transactionType) {
				case 'Promotion':
				case 'Betting':
					$reportService->addToFormattedArray($transactionLogsDetails[$key], $resultTransaction, 'dateTime');
					$reportService->addTypeProduct($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addGameDetailsFields($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addGameResultFields($transactionLogsDetails[$key], $resultTransaction);

					$reportService->addAmount($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addStakeTurnoverFields($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addToFormattedArray($transactionLogsDetails[$key], $resultTransaction, 'grossRake');
					$reportService->addMembersWLCommision($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addCashBalanceGame($transactionLogsDetails[$key], $resultTransaction);

					break;
				case 'Credit':
					$reportService->addToFormattedArray($transactionLogsDetails[$key], $resultTransaction, 'dateTime');
					$reportService->addTypeProduct($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addAmount($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addCashBalanceGame($transactionLogsDetails[$key], $resultTransaction);
					break;
				case 'Transfer':
					$reportService->addToFormattedArray($transactionLogsDetails[$key], $resultTransaction, 'dateTime');
					$reportService->addTypeProduct($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addTransferDescriptionFields($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addAmount($transactionLogsDetails[$key], $resultTransaction);
					$reportService->addCashBalanceGame($transactionLogsDetails[$key], $resultTransaction);
					break;
			}
		}

		return ['content' => $transactionLogsDetails, 'totalRow' => $totalRow];
	}

	private function transactionLogBetting($clientID, $dateTimeRange)
	{
		$result = TransactionDetail::select(
			DB::raw("
				ANY_VALUE(actualCashBalance) AS cashBalance,
				ANY_VALUE(actualAvailableCredit) AS availableCredit,
				ANY_VALUE(actualPlayableBalance) AS playableBalance
			")
		)
			->addBettingListFields()
			->bmSelectTransactionType('betting')
			->winloseMemberComm()
			->selectDateTime('betting')
			->bettingListJoin()
			->event('betting')
			->where('clientID', '=', $clientID)
			->whereBetween('timestampEnd', [$dateTimeRange['startDate'], $dateTimeRange['endDate']])
			->groupByRound()
			->get();

		return empty($result) ? [] : $result->toArray();
	}

	private function transactionLogPromotion($clientID, $dateTimeRange)
	{
		$result = TransactionDetail::select(
			DB::raw("
				ANY_VALUE(actualCashBalance) AS cashBalance,
				ANY_VALUE(actualAvailableCredit) AS availableCredit,
				ANY_VALUE(actualPlayableBalance) AS playableBalance
			")
		)
			->defaultListFields()
			->bmSelectTransactionType('promotion')
			->winloseMemberComm()
			->selectDateTime('promotion')
			->gameProductLeftJoin()
			->event('promotion')
			->where('clientID', '=', $clientID)
			->whereBetween('timestampEnd', [$dateTimeRange['startDate'], $dateTimeRange['endDate']])
			->groupByRound()
			->get();

		return empty($result) ? [] : $result->toArray();
	}

	private function transactionLogTransfer($clientID, $dateTimeRange)
	{
		$result = Transfer::selectTransferListFields()
			->joinTransferType()
			->bmSelectTransactionType('transfer')
			->whereBetween('timestampCreated', [$dateTimeRange['startDate'], $dateTimeRange['endDate']])
			->where('clientID', '=', $clientID)
			->get();

		return empty($result) ? [] : $result->toArray();
	}

	private function transactionLogCredit($clientID, $dateTimeRange)
	{
		$result = Credit::select(
			'actualCashBalance as cashBalance',
			'actualAvailableCredit as availableCredit',
			'amount as amount'
		)
			->bmSelectTransactionType('credit')
			->addCreditListFields()
			->whereBetween('timestampCreated', [$dateTimeRange['startDate'], $dateTimeRange['endDate']])
			->where('clientID', '=', $clientID)
			->get();

		return empty($result) ? [] : $result->toArray();
	}

	private function createTransactionLogTempTable()
	{
		$tableName = 'transactionlogsreport';

		DB::statement(
			"CREATE TEMPORARY TABLE $tableName
			(transactionLogID INT PRIMARY KEY AUTO_INCREMENT,
			transactionDetID BIGINT NOT NULL DEFAULT 0,
			roundID VARCHAR(100) NOT NULL DEFAULT 0,
			roundDetID VARCHAR(100) NOT NULL DEFAULT 0,
			`dateTime` DATETIME(6),
			transactionType VARCHAR(10),
			transferTypeName  VARCHAR(20),
			`event` CHAR(1) NOT NULL Default '',
			result JSON ,
			`message` VARCHAR(255),
			productID INT NOT NULL DEFAULT 0,
			productName VARCHAR(50) NOT NULL Default '',
			gameID INT NOT NULL DEFAULT 0,
			gameName VARCHAR(50) NOT NULL Default '',
			commission DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			stake DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			turnover DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			grossRake DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			netwin DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			amount DECIMAL(19,6) NOT NULL DEFAULT 0.000000,
			cashBalance DECIMAL(19,6),
			availableCredit DECIMAL(19,6),
			playableBalance DECIMAL(19,6),
			derivedBetGrouping VARCHAR(100)) "
		);

		return $tableName;
	}

	public function getTransactionBetDetails($transactionDetID, $clientID)
	{
		$betDetails = TransactionDetail::select(
			'transactiondetail.transactionDetID',
			'transactiondetailresult.result',
			'transactiondetail.roundID',
			'transactiondetail.roundDetID',
			'game.gameID',
			'game.productID',
			'game.gameProviderID'
		)
			->leftJoin(
				'transactiondetailresult',
				'transactiondetailresult.transactionDetID',
				'transactiondetail.transactionDetID'
			)
			->join('game', 'game.gameID', 'transactiondetail.gameID')
			->where('transactiondetail.transactionDetID', '=', $transactionDetID)
			->where('clientID', '=', $clientID)
			->first();

		$languageService = new LanguageService();
		$languageID = $languageService->gameLangFormat($betDetails->productID);

		$reportService = new ReportService();
		$payload = $reportService->getPayload($betDetails, $languageID);

		$serverUrl = GameConfig::select('url')
			->GameID($betDetails->gameID)
			->GetConfigName('report')
			->value('url');
		$serverUrl = is_null($serverUrl) ? ' ' : $serverUrl;

		return urlAddQuery(replaceDomain($serverUrl, URL::to('/')), $payload);
	}
}
