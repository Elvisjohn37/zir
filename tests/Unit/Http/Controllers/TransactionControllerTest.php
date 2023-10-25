<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use App\Http\Controllers\TransactionController;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Services\ReportServiceMock;
use Tests\Mock\Http\Services\ZirconApiServiceMock;
use Tests\Mock\Http\Containers\ReportContainerMock;
use Tests\Mock\Http\Repositories\TransactionRepositoryMock;
use App\Http\Requests\GetStatementReportReq;
use App\Http\Requests\GetPlayerBetListReq;
use App\Http\Requests\GetStatementDetailsReq;
use App\Http\Requests\GetRunningBetReq;
use App\Http\Requests\GetTransactionLogReq;
use App\Http\Requests\GetBetDetailsReq;
use Tests\Mock\Laravel\AuthMock;
use Tests\Mock\Laravel\RedirectMock;
use App\Http\Requests\BetInfoReq;
use RuntimeException;

class TransactionControllerTest extends TestCase
{
	use ResponseFormatterServiceMock,
		ReportServiceMock,
		ReportContainerMock,
		TransactionRepositoryMock,
		AuthMock,
		RedirectMock,
		ZirconApiServiceMock;

	private function createController(
		$responseFormatterService = null,
		$reportContainer = null,
		$transactionRepository = null
	) {
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockResponseFormatterService();

		$reportContainer = $reportContainer !== null ? $reportContainer : $this->mockReportContainer();

		$transactionRepository =
			$transactionRepository !== null ? $transactionRepository : $this->mockTransactionRepository();

		return new TransactionController($responseFormatterService, $reportContainer, $transactionRepository);
	}

	public function testGetStatementRangeShouldGetStatementDateRange()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServiceGetDateRange();
		$reportContainer = $this->stubReportContainerReportService($reportService);

		$transactionController = $this->createController($responseFormatterService, $reportContainer);
		$statementRange = $transactionController->getStatementRange();

		$this->assertEquals($this->reportServiceDefaultDateRange(), $statementRange);
	}

	public function testGetStatementRangeShouldGetCorrectStatementDateRangeWhenDateChanges()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$statementRangeData = [
			['number' => 3, 'startDate' => '2022-11-01', 'endDate' => '2022-11-31'],
			['number' => 2, 'startDate' => '2022-12-01', 'endDate' => '2022-12-30'],
			['number' => 1, 'startDate' => '2023-02-01', 'endDate' => '2023-02-05'],
		];

		$reportService = $this->stubReportServiceGetDateRange($statementRangeData);
		$reportContainer = $this->stubReportContainerReportService($reportService);

		$transactionController = $this->createController($responseFormatterService, $reportContainer);
		$statementRange = $transactionController->getStatementRange();

		$this->assertEquals($statementRangeData, $statementRange);
	}

	private function getStatementDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServiceGetDateRange();
		$this->stubReportServiceGetDate();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetStatement();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetStatementReportShouldGetStatementReportData()
	{
		$clientID = '123';
		$this->authLoginUser($clientID);
		$arrange = $this->getStatementDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$statement = $transactionController->getStatementReport(
			new GetStatementReportReq(['rangeNo' => 1, 'showConfig' => 1])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'startDate' => '2022-10-01',
				'endDate' => '2022-10-03',
				'dateRange' => $this->reportServiceDefaultDateRange(),
			],
			$statement
		);
	}

	public function testGetStatementReportShouldGetCorrectStatementReportDataWhenRangeChanges()
	{
		$clientID = '123';
		$this->authLoginUser($clientID);
		$arrange = $this->getStatementDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$statement = $transactionController->getStatementReport(
			new GetStatementReportReq(['rangeNo' => 2, 'showConfig' => 1])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'startDate' => '2022-09-01',
				'endDate' => '2022-09-30',
				'dateRange' => $this->reportServiceDefaultDateRange(),
			],
			$statement
		);
	}

	public function testGetStatementReportShouldGetCorrectStatementReportDataWhenClientChanges()
	{
		$clientID = '234';
		$this->authLoginUser($clientID);
		$arrange = $this->getStatementDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$statement = $transactionController->getStatementReport(
			new GetStatementReportReq(['rangeNo' => 1, 'showConfig' => 1])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'startDate' => '2022-10-01',
				'endDate' => '2022-10-03',
				'dateRange' => $this->reportServiceDefaultDateRange(),
			],
			$statement
		);
	}

	public function testGetStatementReportShouldGetCorrectDateRangeWhenDateChanges()
	{
		$clientID = '123';
		$this->authLoginUser($clientID);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$statementRangeData = [
			['number' => 3, 'startDate' => '2022-11-01', 'endDate' => '2022-11-31'],
			['number' => 2, 'startDate' => '2022-12-01', 'endDate' => '2022-12-30'],
			['number' => 1, 'startDate' => '2023-02-01', 'endDate' => '2023-02-31'],
		];
		$reportService = $this->stubReportServiceGetDateRange($statementRangeData);
		$this->stubReportServiceGetDate($statementRangeData);
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetStatement();

		$transactionController = $this->createController(
			$responseFormatterService,
			$reportContainer,
			$transactionRepository
		);

		$statement = $transactionController->getStatementReport(
			new GetStatementReportReq(['rangeNo' => 1, 'showConfig' => 1])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'startDate' => '2023-02-01',
				'endDate' => '2023-02-31',
				'dateRange' => $statementRangeData,
			],
			$statement
		);
	}

	public function testGetStatementReportShouldNotGetConfigWhenShowConfigParamIsNotTrue()
	{
		$clientID = '123';
		$this->authLoginUser($clientID);
		$arrange = $this->getStatementDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$statement = $transactionController->getStatementReport(new GetStatementReportReq(['rangeNo' => 1]));

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'startDate' => '2022-10-01',
				'endDate' => '2022-10-03',
			],
			$statement
		);
	}

	private function getPlayerBetListDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServiceLocalDecrypt();
		$this->stubReportServicePagingOffsetLimit();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetPlayerBetList();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetPlayerBetListShouldGetPlayerBetListData()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 1;
		$productID = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerBetListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerBetList = $transactionController->getPlayerBetList(
			new GetPlayerBetListReq(['date' => $date, 'page' => $page, 'productID' => $productID])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'productID' => $productID,
				'rowsPerPage' => 20,
			],
			$playerBetList
		);
	}

	public function testGetPlayerBetListShouldGetCorrectPlayerBetListDataWhenDateChanges()
	{
		$clientID = '123';
		$date = '2022-10-02';
		$page = 1;
		$productID = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerBetListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerBetList = $transactionController->getPlayerBetList(
			new GetPlayerBetListReq(['date' => $date, 'page' => $page, 'productID' => $productID])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'productID' => $productID,
				'rowsPerPage' => 20,
			],
			$playerBetList
		);
	}

	public function testGetPlayerBetListShouldGetCorrectPlayerBetListDataWhenPageChanges()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 2;
		$productID = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerBetListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerBetList = $transactionController->getPlayerBetList(
			new GetPlayerBetListReq(['date' => $date, 'page' => $page, 'productID' => $productID])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'productID' => $productID,
				'rowsPerPage' => 20,
			],
			$playerBetList
		);
	}

	public function testGetPlayerBetListShouldGetCorrectPlayerBetListDataWhenProductChanges()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 1;
		$productID = 2;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerBetListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerBetList = $transactionController->getPlayerBetList(
			new GetPlayerBetListReq(['date' => $date, 'page' => $page, 'productID' => $productID])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'productID' => $productID,
				'rowsPerPage' => 20,
			],
			$playerBetList
		);
	}

	public function testGetPlayerBetListShouldGetCorrectPlayerBetListDataWhenClientChanges()
	{
		$clientID = '234';
		$date = '2022-10-01';
		$page = 1;
		$productID = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerBetListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerBetList = $transactionController->getPlayerBetList(
			new GetPlayerBetListReq(['date' => $date, 'page' => $page, 'productID' => $productID])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'productID' => $productID,
				'rowsPerPage' => 20,
			],
			$playerBetList
		);
	}

	public function getPlayerPromoListDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServicePagingOffsetLimit();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetPlayerPromotionDetail();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetPlayerPromoListShouldGetPromoReportData()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerPromoListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerPromoList = $transactionController->getPlayerPromoList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerPromoList
		);
	}

	public function testGetPlayerPromoListShouldGetCorrectPromoReportDataWhenDateChanges()
	{
		$clientID = '123';
		$date = '2022-10-02';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerPromoListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerPromoList = $transactionController->getPlayerPromoList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerPromoList
		);
	}

	public function testGetPlayerPromoListShouldGetCorrectPromoReportDataWhenPageChanges()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 2;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerPromoListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerPromoList = $transactionController->getPlayerPromoList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerPromoList
		);
	}

	public function testGetPlayerPromoListShouldGetCorrectPromoReportDataWhenClientChanges()
	{
		$clientID = '234';
		$date = '2022-10-01';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getPlayerPromoListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerPromoList = $transactionController->getPlayerPromoList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerPromoList
		);
	}

	public function getGetPlayerTransferListDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServicePagingOffsetLimit();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetPlayerTransferList();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetPlayerTransferListShouldGetPlayerTransferReport()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerTransferListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerTransferList = $transactionController->getPlayerTransferList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerTransferList
		);
	}

	public function testGetPlayerTransferListShouldGetCorrectPlayerTransferReportWhenDateChanges()
	{
		$clientID = '123';
		$date = '2022-10-02';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerTransferListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerTransferList = $transactionController->getPlayerTransferList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerTransferList
		);
	}

	public function testGetPlayerTransferListShouldGetCorrectPlayerTransferReportWhenPageChanges()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 2;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerTransferListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerTransferList = $transactionController->getPlayerTransferList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerTransferList
		);
	}

	public function testGetPlayerTransferListShouldGetCorrectPlayerTransferReportWhenClientChanges()
	{
		$clientID = '234';
		$date = '2022-10-01';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerTransferListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerTransferList = $transactionController->getPlayerTransferList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerTransferList
		);
	}

	public function getGetPlayerCreditListDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServicePagingOffsetLimit();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetPlayerCreditList();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetPlayerCreditListShouldGetPlayerCreditReport()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerCreditListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerCreditList = $transactionController->getPlayerCreditList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerCreditList
		);
	}

	public function testGetPlayerCreditListShouldGetCorrectPlayerCreditReportWhenDateChanges()
	{
		$clientID = '123';
		$date = '2022-10-02';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerCreditListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerCreditList = $transactionController->getPlayerCreditList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerCreditList
		);
	}

	public function testGetPlayerCreditListShouldGetCorrectPlayerCreditReportWhenPageChanges()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$page = 2;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerCreditListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerCreditList = $transactionController->getPlayerCreditList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerCreditList
		);
	}

	public function testGetPlayerCreditListShouldGetCorrectPlayerCreditReportWhenClientChanges()
	{
		$clientID = '234';
		$date = '2022-10-01';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetPlayerCreditListDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$playerCreditList = $transactionController->getPlayerCreditList(
			new GetStatementDetailsReq(['date' => $date, 'page' => $page])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'date' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$playerCreditList
		);
	}

	private function getGetRunningBetsDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServicePagingOffsetLimit();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetRunningBets();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetRunningBetsShouldGetPlayerRunningBetsReport()
	{
		$clientID = '123';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetRunningBetsDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$runningBets = $transactionController->getRunningBets(new GetRunningBetReq(['page' => $page]));

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$runningBets
		);
	}

	public function testGetRunningBetsShouldGetCorrectPlayerRunningBetsReportWhenPageChanges()
	{
		$clientID = '123';
		$page = 2;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetRunningBetsDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$runningBets = $transactionController->getRunningBets(new GetRunningBetReq(['page' => $page]));

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$runningBets
		);
	}

	public function testGetRunningBetsShouldGetCorrectPlayerRunningBetsReportWhenClientChanges()
	{
		$clientID = '234';
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetRunningBetsDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);

		$runningBets = $transactionController->getRunningBets(new GetRunningBetReq(['page' => $page]));

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$runningBets
		);
	}

	private function getGetTransactionLogDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServicePagingOffsetLimit();
		$this->stubReportServiceDateTimeRange();
		$this->stubReportServiceGetDateRange();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetTransactionLog();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetTransactionLogShouldGetTransactionLogReportData()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$showConfig = 1;
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetTransactionLogDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$transactionLog = $transactionController->getTransactionLog(
			new GetTransactionLogReq(['page' => $page, 'date' => $date, 'showConfig' => $showConfig])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'tdDateRange' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
				'dateRange' => $this->reportServiceDefaultDateRange(),
			],
			$transactionLog
		);
	}

	public function testGetTransactionLogShouldGetCorrectTransactionLogReportDataWhenDateChanges()
	{
		$clientID = '123';
		$date = '2022-10-02';
		$showConfig = 1;
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetTransactionLogDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$transactionLog = $transactionController->getTransactionLog(
			new GetTransactionLogReq(['page' => $page, 'date' => $date, 'showConfig' => $showConfig])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'tdDateRange' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
				'dateRange' => $this->reportServiceDefaultDateRange(),
			],
			$transactionLog
		);
	}

	public function testGetTransactionLogShouldGetCorrectTransactionLogReportDataWhenPageChanges()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$showConfig = 2;
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetTransactionLogDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$transactionLog = $transactionController->getTransactionLog(
			new GetTransactionLogReq(['page' => $page, 'date' => $date, 'showConfig' => $showConfig])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'tdDateRange' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
				'dateRange' => $this->reportServiceDefaultDateRange(),
			],
			$transactionLog
		);
	}

	public function testGetTransactionLogShouldGetCorrectTransactionLogReportDataWhenClientChanges()
	{
		$clientID = '234';
		$date = '2022-10-01';
		$showConfig = 1;
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetTransactionLogDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$transactionLog = $transactionController->getTransactionLog(
			new GetTransactionLogReq(['page' => $page, 'date' => $date, 'showConfig' => $showConfig])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'tdDateRange' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
				'dateRange' => $this->reportServiceDefaultDateRange(),
			],
			$transactionLog
		);
	}

	public function testGetTransactionLogShouldGetCorrectTransactionLogReportDataWhenConfigChanges()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$showConfig = 1;
		$page = 1;
		$this->authLoginUser($clientID);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServicePagingOffsetLimit();
		$this->stubReportServiceDateTimeRange();
		$newDateRange = [
			['number' => 3, 'startDate' => '2022-11-01', 'endDate' => '2022-11-31'],
			['number' => 2, 'startDate' => '2022-12-01', 'endDate' => '2022-12-30'],
			['number' => 1, 'startDate' => '2023-02-01', 'endDate' => '2023-02-05'],
		];
		$this->stubReportServiceGetDateRange($newDateRange);
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetTransactionLog();

		$transactionController = $this->createController(
			$responseFormatterService,
			$reportContainer,
			$transactionRepository
		);
		$transactionLog = $transactionController->getTransactionLog(
			new GetTransactionLogReq(['page' => $page, 'date' => $date, 'showConfig' => $showConfig])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'tdDateRange' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
				'dateRange' => $newDateRange,
			],
			$transactionLog
		);
	}

	public function testGetTransactionLogShouldNotGetConfigWhenShowConfigParamIsNotTrue()
	{
		$clientID = '123';
		$date = '2022-10-01';
		$showConfig = 0;
		$page = 1;
		$this->authLoginUser($clientID);
		$arrange = $this->getGetTransactionLogDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$transactionLog = $transactionController->getTransactionLog(
			new GetTransactionLogReq(['page' => $page, 'date' => $date, 'showConfig' => $showConfig])
		);

		$this->assertEquals(
			[
				'clientID' => $clientID,
				'tdDateRange' => $date,
				'pagingOffsetLimit' => ['page' => $page, 'limit' => 20],
				'rowsPerPage' => 20,
			],
			$transactionLog
		);
	}

	private function getGetBetDetailsDefaultArrangement()
	{
		$this->stubRedirectTo();
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$reportService = $this->stubReportServiceLocalDecrypt();
		$reportContainer = $this->stubReportContainerReportService($reportService);
		$transactionRepository = $this->stubTransactionRepositoryGetTransactionBetDetails();

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
			'transactionRepository' => $transactionRepository,
		];
	}

	public function testGetBetDetailsShouldRedirectToBetDetails()
	{
		$clientID = '123';
		$betID = 'bet123';
		$this->authLoginUser($clientID);
		$arrange = $this->getGetBetDetailsDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$betDetails = $transactionController->getBetDetails(new GetBetDetailsReq(['betID' => $betID]));

		$this->assertEquals('redirecttowww.' . $betID . '-' . $clientID . '.com', $betDetails);
	}

	public function testGetBetDetailsShouldRedirectToCorrectBetDetailsWhenBetIdChanges()
	{
		$clientID = '123';
		$betID = 'bet234';
		$this->authLoginUser($clientID);
		$arrange = $this->getGetBetDetailsDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$betDetails = $transactionController->getBetDetails(new GetBetDetailsReq(['betID' => $betID]));

		$this->assertEquals('redirecttowww.' . $betID . '-' . $clientID . '.com', $betDetails);
	}

	public function testGetBetDetailsShouldRedirectToCorrectBetDetailsWhenClientChanges()
	{
		$clientID = '234';
		$betID = 'bet123';
		$this->authLoginUser($clientID);
		$arrange = $this->getGetBetDetailsDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			$arrange['transactionRepository']
		);
		$betDetails = $transactionController->getBetDetails(new GetBetDetailsReq(['betID' => $betID]));

		$this->assertEquals('redirecttowww.' . $betID . '-' . $clientID . '.com', $betDetails);
	}

	private function betInfoDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$zirconApiService = $this->stubZirconApiServiceEyeconBetDetails();
		$this->stubZirconApiServiceFunkyBetDetails();
		$reportContainer = $this->stubReportContainerZirconApiService($zirconApiService);

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
		];
	}

	public function testBetInfoShouldGetEyeconBetInfoUrl()
	{
		$payload = 'load123';
		$type = 'eyecon';
		$arrange = $this->betInfoDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			null
		);
		$betInfo = $transactionController->betInfo($type, new BetInfoReq(['payload' => $payload]));

		$this->assertEquals('www.' . $type . '-' . urlencode($payload) . '.com', $betInfo);
	}

	public function testBetInfoShouldGetCorrectEyeconBetInfoUrlWhenPayloadChanges()
	{
		$payload = 'load234';
		$type = 'eyecon';
		$arrange = $this->betInfoDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			null
		);
		$betInfo = $transactionController->betInfo($type, new BetInfoReq(['payload' => $payload]));

		$this->assertEquals('www.' . $type . '-' . urlencode($payload) . '.com', $betInfo);
	}

	public function testBetInfoShouldGetFunkyBetInfoUrl()
	{
		$payload = 'load123';
		$type = 'funky';
		$arrange = $this->betInfoDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			null
		);
		$betInfo = $transactionController->betInfo($type, new BetInfoReq(['payload' => $payload]));

		$this->assertEquals('www.' . $type . '-' . urlencode($payload) . '.com', $betInfo);
	}

	public function testBetInfoShouldGetCorrectFunkyBetInfoUrlWhenPayloadChanges()
	{
		$payload = 'load234';
		$type = 'funky';
		$arrange = $this->betInfoDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			null
		);
		$betInfo = $transactionController->betInfo($type, new BetInfoReq(['payload' => $payload]));

		$this->assertEquals('www.' . $type . '-' . urlencode($payload) . '.com', $betInfo);
	}

	public function testBetInfoShouldThrowExceptionWhenTypeIsUnknown()
	{
		$payload = 'load234';
		$type = 'unknownType';
		$arrange = $this->betInfoDefaultArrangement();

		$this->expectException(RuntimeException::class);

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			null
		);
		$transactionController->betInfo($type, new BetInfoReq(['payload' => $payload]));
	}

	private function settleRunningGameDefaultArrangement()
	{
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$zirconApiService = $this->stubZirconApiServiceSettleRunningGame();
		$reportContainer = $this->stubReportContainerZirconApiService($zirconApiService);

		return [
			'responseFormatterService' => $responseFormatterService,
			'reportContainer' => $reportContainer,
		];
	}

	function testSettleRunningGameShouldSettleRunningGames()
	{
		$clientID = '123';
		$this->authLoginUser($clientID);
		$arrange = $this->settleRunningGameDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			null
		);
		$settledRunningGame = $transactionController->settleRunningGame();

		$this->assertEquals($clientID, $settledRunningGame);
	}

	function testSettleRunningGameShouldSettleCorrectRunningGamesWhenClientChanges()
	{
		$clientID = '234';
		$this->authLoginUser($clientID);
		$arrange = $this->settleRunningGameDefaultArrangement();

		$transactionController = $this->createController(
			$arrange['responseFormatterService'],
			$arrange['reportContainer'],
			null
		);
		$settledRunningGame = $transactionController->settleRunningGame();

		$this->assertEquals($clientID, $settledRunningGame);
	}
}
