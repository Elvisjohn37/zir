<?php

namespace App\Http\Containers;

use App\Http\Services\ReportService;
use App\Http\Services\ZirconApiService;

class ReportContainer
{
	private $reportService;
	private $zirconApiService;

	public function __construct(ReportService $reportService, ZirconApiService $zirconApiService)
	{
		$this->reportService = $reportService;
		$this->zirconApiService = $zirconApiService;
	}

	public function reportService()
	{
		return $this->reportService;
	}

	public function zirconApiService()
	{
		return $this->zirconApiService;
	}
}
