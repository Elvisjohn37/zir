<?php

namespace Tests\Mock\Http\Containers;

use App\Http\Containers\ReportContainer;

trait ReportContainerMock
{
	private $reportContainer;

	protected function mockReportContainer()
	{
		if ($this->reportContainer === null) {
			$this->reportContainer = $this->createMock(ReportContainer::class);
		}

		return $this->reportContainer;
	}

	protected function stubReportContainerReportService($serviceClass = null)
	{
		if ($serviceClass === null) {
			$serviceClass = $this->mockReportService();
		}

		$this->mockReportContainer()
			->method('reportService')
			->willReturn($serviceClass);

		return $this->reportContainer;
	}

	protected function stubReportContainerZirconApiService($serviceClass = null)
	{
		if ($serviceClass === null) {
			$serviceClass = $this->mockZirconApiService();
		}

		$this->mockReportContainer()
			->method('zirconApiService')
			->willReturn($serviceClass);

		return $this->reportContainer;
	}
}
