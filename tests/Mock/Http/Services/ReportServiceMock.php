<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\ReportService;

trait ReportServiceMock
{
	private $reportSiteService;

	private $dateRange = [
		['number' => 3, 'startDate' => '2022-08-01', 'endDate' => '2022-08-31'],
		['number' => 2, 'startDate' => '2022-09-01', 'endDate' => '2022-09-30'],
		['number' => 1, 'startDate' => '2022-10-01', 'endDate' => '2022-10-03'],
	];

	private $reportServiceReturnValues = [
		'getDateRange' => null,
		'getDate' => null,
		'pagingOffsetLimit' => null,
	];

	protected function mockReportService()
	{
		if ($this->reportSiteService === null) {
			$this->reportSiteService = $this->createMock(ReportService::class);
		}

		return $this->reportSiteService;
	}

	protected function reportServiceDefaultDateRange()
	{
		return $this->reportServiceReturnValues['getDateRange'] == null
			? $this->dateRange
			: $this->reportServiceReturnValues['getDateRange'];
	}

	protected function stubReportServiceGetDateRange($returnValue = null)
	{
		if ($returnValue != null) {
			$this->reportServiceReturnValues['getDateRange'] = $returnValue;
		}

		$this->mockReportService()
			->method('getDateRange')
			->will(
				$this->returnCallback(function () {
					return $this->reportServiceDefaultDateRange();
				})
			);

		return $this->reportSiteService;
	}

	protected function stubReportServiceGetDate($returnValue = null)
	{
		if ($returnValue != null) {
			$this->reportServiceReturnValues['getDate'] = $returnValue;
		}

		$this->mockReportService()
			->method('getDate')
			->will(
				$this->returnCallback(function ($rangeNo) {
					$data =
						$this->reportServiceReturnValues['getDate'] !== null
							? $this->reportServiceReturnValues['getDate']
							: $this->dateRange;

					return current(
						array_filter($data, function ($date) use ($rangeNo) {
							return $date['number'] == $rangeNo;
						})
					);
				})
			);

		return $this->reportSiteService;
	}

	protected function stubReportServiceLocalDecrypt()
	{
		$this->mockReportService()
			->method('localDecrypt')
			->willReturnArgument(0);

		return $this->reportSiteService;
	}

	protected function stubReportServicePagingOffsetLimit($returnValue = null)
	{
		if ($returnValue != null) {
			$this->reportServiceReturnValues['pagingOffsetLimit'] = $returnValue;
		}

		$this->mockReportService()
			->method('pagingOffsetLimit')
			->will(
				$this->returnCallback(function ($page) {
					return $this->reportServiceReturnValues['pagingOffsetLimit'] === null
						? ['page' => $page, 'limit' => 20]
						: $this->reportServiceReturnValues['pagingOffsetLimit'];
				})
			);

		return $this->reportSiteService;
	}

	protected function stubReportServiceDateTimeRange($returnValue = null)
	{
		$this->mockReportService()
			->method('dateTimeRange')
			->willReturnArgument(0);

		return $this->reportSiteService;
	}
}
