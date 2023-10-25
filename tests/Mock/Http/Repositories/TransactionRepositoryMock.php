<?php

namespace Tests\Mock\Http\Repositories;

use App\Http\Repositories\TransactionRepository;

trait TransactionRepositoryMock
{
	private $transactionRepository;

	protected function mockTransactionRepository()
	{
		if ($this->transactionRepository === null) {
			$this->transactionRepository = $this->createMock(TransactionRepository::class);
		}

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetStatement()
	{
		$this->mockTransactionRepository()
			->method('getStatement')
			->will(
				$this->returnCallback(function ($clientID, $startDate, $endDate) {
					return [
						'clientID' => $clientID,
						'startDate' => $startDate,
						'endDate' => $endDate,
					];
				})
			);

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetPlayerBetList()
	{
		$this->mockTransactionRepository()
			->method('getPlayerBetList')
			->will(
				$this->returnCallback(function ($clientID, $date, $productID, $pageLimitOffset) {
					return [
						'clientID' => $clientID,
						'date' => $date,
						'productID' => $productID,
						'pagingOffsetLimit' => $pageLimitOffset,
					];
				})
			);

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetPlayerPromotionDetail()
	{
		$this->mockTransactionRepository()
			->method('getPlayerPromotionDetail')
			->will(
				$this->returnCallback(function ($clientID, $date, $pageLimitOffset) {
					return [
						'clientID' => $clientID,
						'date' => $date,
						'pagingOffsetLimit' => $pageLimitOffset,
					];
				})
			);

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetPlayerTransferList()
	{
		$this->mockTransactionRepository()
			->method('getPlayerTransferList')
			->will(
				$this->returnCallback(function ($clientID, $date, $pageLimitOffset) {
					return [
						'clientID' => $clientID,
						'date' => $date,
						'pagingOffsetLimit' => $pageLimitOffset,
					];
				})
			);

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetPlayerCreditList()
	{
		$this->mockTransactionRepository()
			->method('getPlayerCreditList')
			->will(
				$this->returnCallback(function ($clientID, $date, $pageLimitOffset) {
					return [
						'clientID' => $clientID,
						'date' => $date,
						'pagingOffsetLimit' => $pageLimitOffset,
					];
				})
			);

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetRunningBets()
	{
		$this->mockTransactionRepository()
			->method('getRunningBets')
			->will(
				$this->returnCallback(function ($clientID, $pageLimitOffset) {
					return [
						'clientID' => $clientID,
						'pagingOffsetLimit' => $pageLimitOffset,
					];
				})
			);

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetTransactionLog()
	{
		$this->mockTransactionRepository()
			->method('getTransactionLog')
			->will(
				$this->returnCallback(function ($clientID, $dateRange, $pageLimitOffset) {
					return [
						'clientID' => $clientID,
						'tdDateRange' => $dateRange,
						'pagingOffsetLimit' => $pageLimitOffset,
					];
				})
			);

		return $this->transactionRepository;
	}

	protected function stubTransactionRepositoryGetTransactionBetDetails()
	{
		$this->mockTransactionRepository()
			->method('getTransactionBetDetails')
			->will(
				$this->returnCallback(function ($betID, $clientID) {
					return 'www.' . $betID . '-' . $clientID . '.com';
				})
			);

		return $this->transactionRepository;
	}
}
