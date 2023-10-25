<?php

namespace App\Http\Controllers;

use App\Http\Services\ResponseFormatterService;
use App\Http\Repositories\TransactionRepository;
use App\Http\Containers\ReportContainer;
use App\Http\Repositories\ClientRepository;
use App\Http\Requests\GetStatementReportReq;
use App\Http\Requests\GetStatementDetailsReq;
use App\Http\Requests\GetBetDetailsReq;
use App\Http\Requests\GetRunningBetReq;
use App\Http\Requests\GetPlayerBetListReq;
use App\Http\Requests\GetTransactionLogReq;
use App\Http\Requests\BetInfoReq;
use Redirect;
use Auth;
use RuntimeException;

class TransactionController extends BaseController
{
	private $responseFormatter;
	private $reportContainer;
	private $transactionRepository;
	private $clientRepository;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		ReportContainer $reportContainer,
		TransactionRepository $transactionRepository,
		ClientRepository $clientRepository
	) {
		$this->responseFormatter = $responseFormatter;
		$this->reportContainer = $reportContainer;
		$this->transactionRepository = $transactionRepository;
		$this->clientRepository = $clientRepository;
	}

	public function getStatementRange()
	{
		$dateRange = $this->reportContainer->reportService()->getDateRange();
		return $this->responseFormatter->success($dateRange);
	}

	public function getStatementReport(GetStatementReportReq $request)
	{
		$statementDate = $this->reportContainer->reportService()->getDate($request->rangeNo);
		$statement = $this->transactionRepository->getStatement(
			$this->clientRepository->getZirconClientID(Auth::user()->sboClientID),
			$statementDate['startDate'],
			$statementDate['endDate']
		);

		if ($request->showConfig) {
			$statement['dateRange'] = $this->reportContainer->reportService()->getDateRange();
		}

		return $this->responseFormatter->success($statement);
	}

	public function getPlayerBetList(GetPlayerBetListReq $request)
	{
		$date = $request->input('date');
		$page = $request->input('page');
		$productID = $this->reportContainer->reportService()->localDecrypt($request->input('productID'));

		$pageLimitOffset = $this->reportContainer->reportService()->pagingOffsetLimit($page);

		$statementTransactionDetails = $this->transactionRepository->getPlayerBetList(
			$this->clientRepository->getZirconClientID(Auth::user()->sboClientID),
			$date,
			$productID,
			$pageLimitOffset
		);
		$statementTransactionDetails['rowsPerPage'] = $pageLimitOffset['limit'];

		return $this->responseFormatter->success($statementTransactionDetails);
	}

	public function getPlayerPromoList(GetStatementDetailsReq $request)
	{
		$date = $request->input('date');
		$page = $request->input('page');

		$pageLimitOffset = $this->reportContainer->reportService()->pagingOffsetLimit($page);

		$statementTransactionDetails = $this->transactionRepository->getPlayerPromotionDetail(
			$this->clientRepository->getZirconClientID(Auth::user()->sboClientID),
			$date,
			$pageLimitOffset
		);
		$statementTransactionDetails['rowsPerPage'] = $pageLimitOffset['limit'];

		return $this->responseFormatter->success($statementTransactionDetails);
	}

	public function getPlayerTransferList(GetStatementDetailsReq $request)
	{
		$date = $request->input('date');
		$page = $request->input('page');

		$pageLimitOffset = $this->reportContainer->reportService()->pagingOffsetLimit($page);

		$playerTransferList = $this->transactionRepository->getPlayerTransferList(
			$this->clientRepository->getZirconClientID(Auth::user()->sboClientID),
			$date,
			$pageLimitOffset
		);
		$playerTransferList['rowsPerPage'] = $pageLimitOffset['limit'];

		return $this->responseFormatter->success($playerTransferList);
	}

	public function getPlayerCreditList(GetStatementDetailsReq $request)
	{
		$date = $request->input('date');
		$page = $request->input('page');

		$pageLimitOffset = $this->reportContainer->reportService()->pagingOffsetLimit($page);

		$playerCreditList = $this->transactionRepository->getPlayerCreditList(
			$this->clientRepository->getZirconClientID(Auth::user()->sboClientID),
			$date,
			$pageLimitOffset
		);
		$playerCreditList['rowsPerPage'] = $pageLimitOffset['limit'];

		return $this->responseFormatter->success($playerCreditList);
	}

	public function getRunningBets(GetRunningBetReq $request)
	{
		$page = $request->input('page');

		$pageLimitOffset = $this->reportContainer->reportService()->pagingOffsetLimit($page);

		$runnungBets = $this->transactionRepository->getRunningBets(
			$this->clientRepository->getZirconClientID(Auth::user()->sboClientID),
			$pageLimitOffset
		);
		$runnungBets['rowsPerPage'] = $pageLimitOffset['limit'];

		return $this->responseFormatter->success($runnungBets);
	}

	public function getTransactionLog(GetTransactionLogReq $request)
	{
		$page = $request->input('page');
		$date = $request->input('date');

		$pageLimitOffset = $this->reportContainer->reportService()->pagingOffsetLimit($page);

		$dateRange = $this->reportContainer->reportService()->dateTimeRange($date);

		$playerTransactionLog = $this->transactionRepository->getTransactionLog(
			$this->clientRepository->getZirconClientID(Auth::user()->sboClientID),
			$dateRange,
			$pageLimitOffset
		);
		$playerTransactionLog['rowsPerPage'] = $pageLimitOffset['limit'];

		if ($request->input('showConfig')) {
			$playerTransactionLog['dateRange'] = $this->reportContainer->reportService()->getDateRange();
		}

		return $this->responseFormatter->success($playerTransactionLog);
	}

	public function getBetDetails(GetBetDetailsReq $request)
	{
		$betID = $this->reportContainer->reportService()->localDecrypt($request->input('betID'));
		$clientID = $this->clientRepository->getZirconClientID(Auth::user()->sboClientID);

		$transactionBetDetails = $this->transactionRepository->getTransactionBetDetails($betID, $clientID);

		return Redirect::to($transactionBetDetails);
	}

	public function betInfo($type, BetInfoReq $request)
	{
		switch ($type) {
			case 'eyecon':
				$apiRequest = $this->reportContainer
					->zirconApiService()
					->eyeconBetDetails(urlencode($request->input('payload')));
				return $this->responseFormatter->success($apiRequest);
			case 'funky':
				$apiRequest = $this->reportContainer
					->zirconApiService()
					->funkyBetDetails(urlencode($request->input('payload')));
				return $this->responseFormatter->success($apiRequest);
			default:
				throw new RuntimeException('Cannot find bet info type ' . $type);
		}
	}

	public function settleRunningGame()
	{
		$sboClientID = Auth::user()->sboClientID;
		return $this->responseFormatter->success(
			$this->reportContainer->zirconApiService()->settleRunningGame($sboClientID)
		);
	}
}
