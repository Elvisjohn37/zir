<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Repositories\AppRepositoryMock;
use Tests\Mock\Http\Containers\ConnectionContainerMock;
use App\Http\Controllers\AppController;

class AppControllerTest extends TestCase
{
	use ResponseFormatterServiceMock, AppRepositoryMock, ConnectionContainerMock;

	private function createController(
		$responseFormatterService = null,
		$appRepository = null,
		$connectionContainer = null
	) {
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockresponseFormatterService();

		$appRepository = $appRepository !== null ? $appRepository : $this->mockAppRepository();

		$connectionContainer = $connectionContainer !== null ? $connectionContainer : $this->mockConnectionContainer();

		return new AppController($responseFormatterService, $appRepository, $connectionContainer);
	}

	public function testHealthcheckShouldCheckAllServiceConnection()
	{
		$connectionContainer = $this->stubConnectionContainerRedis();
		$this->stubConnectionContainerZirconDB();
		$this->stubConnectionContainerMnlDB();
		$this->stubConnectionContainerIomDB();

		$appController = $this->createController(null, null, $connectionContainer);
		$healthCheck = $appController->healthCheck();

		$this->assertEquals(['REDIS' => 'OK', 'ZIRCON_DB' => 'OK', 'IOM_DB' => 'OK', 'MNL_DB' => 'OK'], $healthCheck);
	}

	public function testHealthcheckShouldReponseErrorWhenRedisIsDisconnected()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceJson();
		$connectionContainer = $this->stubConnectionContainerRedis(false);
		$this->stubConnectionContainerZirconDB();
		$this->stubConnectionContainerMnlDB();
		$this->stubConnectionContainerIomDB();

		$appController = $this->createController($responseFormatterService, null, $connectionContainer);
		$healthCheck = $appController->healthCheck();

		$this->assertEquals(
			[
				'response' => ['REDIS' => 'NOT OKAY', 'ZIRCON_DB' => 'OK', 'IOM_DB' => 'OK', 'MNL_DB' => 'OK'],
				'status' => 500,
			],
			$healthCheck
		);
	}

	public function testHealthcheckShouldReponseErrorWhenZirconDbIsDisconnected()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceJson();
		$connectionContainer = $this->stubConnectionContainerRedis();
		$this->stubConnectionContainerZirconDB(false);
		$this->stubConnectionContainerMnlDB();
		$this->stubConnectionContainerIomDB();

		$appController = $this->createController($responseFormatterService, null, $connectionContainer);
		$healthCheck = $appController->healthCheck();

		$this->assertEquals(
			[
				'response' => ['REDIS' => 'OK', 'ZIRCON_DB' => 'NOT OKAY', 'IOM_DB' => 'OK', 'MNL_DB' => 'OK'],
				'status' => 500,
			],
			$healthCheck
		);
	}

	public function testHealthcheckShouldReponseErrorWhenMnlDbIsDisconnected()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceJson();
		$connectionContainer = $this->stubConnectionContainerRedis();
		$this->stubConnectionContainerZirconDB();
		$this->stubConnectionContainerMnlDB(false);
		$this->stubConnectionContainerIomDB();

		$appController = $this->createController($responseFormatterService, null, $connectionContainer);
		$healthCheck = $appController->healthCheck();

		$this->assertEquals(
			[
				'response' => ['REDIS' => 'OK', 'ZIRCON_DB' => 'OK', 'IOM_DB' => 'OK', 'MNL_DB' => 'NOT OKAY'],
				'status' => 500,
			],
			$healthCheck
		);
	}

	public function testHealthcheckShouldReponseErrorWhenIomDbIsDisconnected()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceJson();
		$connectionContainer = $this->stubConnectionContainerRedis();
		$this->stubConnectionContainerZirconDB();
		$this->stubConnectionContainerMnlDB();
		$this->stubConnectionContainerIomDB(false);

		$appController = $this->createController($responseFormatterService, null, $connectionContainer);
		$healthCheck = $appController->healthCheck();

		$this->assertEquals(
			[
				'response' => ['REDIS' => 'OK', 'ZIRCON_DB' => 'OK', 'IOM_DB' => 'NOT OKAY', 'MNL_DB' => 'OK'],
				'status' => 500,
			],
			$healthCheck
		);
	}

	public function testReadyShouldResponseReady()
	{
		$appController = $this->createController();
		$ready = $appController->ready();

		$this->assertEquals('READY', $ready);
	}

	public function testIsMaintenanceShouldGetAppStatus()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$appRepository = $this->stubAppRepositoryIsMaintenance();

		$appController = $this->createController($responseFormatterService, $appRepository);
		$isMaintenance = $appController->isMaintenance();

		$this->assertFalse($isMaintenance);
	}

	public function testIsMaintenanceShouldGetCorrectAppStatusWhenStatusChanges()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$appRepository = $this->stubAppRepositoryIsMaintenance(true);

		$appController = $this->createController($responseFormatterService, $appRepository);
		$isMaintenance = $appController->isMaintenance();

		$this->assertTrue($isMaintenance);
	}
}
