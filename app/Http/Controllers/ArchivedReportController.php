<?php

namespace App\Http\Controllers;

use App\Http\Repositories\ArchivedReportRepository;
use App\Http\Requests\GetGameLedgerReq;
use App\Http\Services\ReportService;
use App\Http\Services\ResponseFormatterService;
use Exception;
use Auth;
use App\Http\Requests\ArchRepFinancialLedgerReq;

class ArchivedReportController extends BaseController
{
	function getGameLedger(GetGameLedgerReq $request)
	{
		$page = $request->input('page');
		$date = $request->input('date');

		$reportService = new ReportService();
		$pageLimitOffset = $reportService->pagingOffsetLimit($page);

		$dateRange = $reportService->dateTimeRange($date);

		$archivedReportRepository = new ArchivedReportRepository();
		$archivedReportRepository->connectJurisdiction(Auth::user()->jurisdictionID);
		if ($archivedReportRepository) {
			$gameLedger = $archivedReportRepository->getGameLedger(
				Auth::user()->fireClientID,
				$dateRange,
				$pageLimitOffset
			);
		} else {
			throw new Exception('Cannot establish DB Connection to jurisdictionID ' . Auth::user()->jurisdictionID);
		}

		$gameLedger['rowsPerPage'] = $pageLimitOffset['limit'];

		if ($request->input('showConfig')) {
			$gameLedger['dateRange'] = $reportService->getDateRange();
		}

		$responseFormatter = new ResponseFormatterService();
		return $responseFormatter->success($gameLedger);
	}

	function getArcFinLedReport(ArchRepFinancialLedgerReq $request)
	{
		$page = $request->input('page');
		$date = $request->input('date');

		$reportService = new ReportService();
		$pageLimitOffset = $reportService->pagingOffsetLimit($page);

		$dateRange = $reportService->dateTimeRange($date);

		$archivedReportRepository = new ArchivedReportRepository();
		$archivedReportRepository->connectJurisdiction(Auth::user()->jurisdictionID);

		if ($archivedReportRepository) {
			$page = $request->input('page');

			$reportService = new ReportService();
			$pageLimitOffset = $reportService->pagingOffsetLimit($page);

			$arcFinLedReport = $archivedReportRepository->getArcFinLedReport(
				$pageLimitOffset,
				$dateRange,
				Auth::user()->fireClientID
			);
			$arcFinLedReport['rowsPerPage'] = $pageLimitOffset['limit'];

			if ($request->input('showConfig')) {
				$arcFinLedReport['dateRange'] = $reportService->getDateRange();
			}

			$responseFormatter = new ResponseFormatterService();
			return $responseFormatter->success($arcFinLedReport);
		} else {
			throw new Exception('Cannot establish DB Connection to jurisdictionID ' . Auth::user()->jurisdictionID);
		}
	}
}
