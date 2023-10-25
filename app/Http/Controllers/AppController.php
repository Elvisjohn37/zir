<?php

namespace App\Http\Controllers;

use App\Http\Repositories\AppRepository;
use App\Http\Services\ResponseFormatterService;
use PDOException;
use Exception;
use App\Http\Containers\ConnectionContainer;

class AppController extends BaseController
{
	private $responseFormatter;
	private $appRepository;
	private $connectionContainer;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		AppRepository $appRepository,
		ConnectionContainer $connectionContainer
	) {
		$this->responseFormatter = $responseFormatter;
		$this->appRepository = $appRepository;
		$this->connectionContainer = $connectionContainer;
	}

	public function healthCheck()
	{
		$status = ['REDIS' => 'OK', 'ZIRCON_DB' => 'OK', 'IOM_DB' => 'OK', 'MNL_DB' => 'OK'];
		$isStatusOk = true;

		try {
			$this->connectionContainer->redis();
		} catch (Exception $e) {
			$status['REDIS'] = 'NOT OKAY';
			$isStatusOk = false;
		}

		try {
			$this->connectionContainer->zirconDB()->getPdo();
		} catch (PDOException $e) {
			$isStatusOk = false;
			$status['ZIRCON_DB'] = 'NOT OKAY';
		}

		try {
			$this->connectionContainer->mnlDB()->getPdo();
		} catch (PDOException $e) {
			$isStatusOk = false;
			$status['MNL_DB'] = 'NOT OKAY';
		}

		try {
			$this->connectionContainer->iomDB()->getPdo();
		} catch (PDOException $e) {
			$isStatusOk = false;
			$status['IOM_DB'] = 'NOT OKAY';
		}

		if ($isStatusOk) {
			return $status;
		} else {
			return $this->responseFormatter->json($status, 500);
		}
	}

	public function ready()
	{
		return 'READY';
	}

	public function isMaintenance()
	{
		return $this->responseFormatter->success($this->appRepository->isMaintenance());
	}
}
