<?php

namespace App\Http\Containers;

use App\Http\Repositories\ArchivedReportRepository;
use Illuminate\Support\Facades\Redis;
use DB;

class ConnectionContainer
{
	private $archivedReportRepository;

	public function __construct(ArchivedReportRepository $archivedReportRepository)
	{
		$this->archivedReportRepository = $archivedReportRepository;
	}

	public function redis()
	{
		return Redis::connection();
	}

	public function zirconDB()
	{
		return DB::connection('mysql');
	}

	public function mnlDB()
	{
		$this->archivedReportRepository->connectJurisdiction(1);
		return $this->archivedReportRepository->connect();
	}

	public function iomDB()
	{
		$this->archivedReportRepository->connectJurisdiction(2);
		return $this->archivedReportRepository->connect();
	}
}
