<?php

namespace Tests\Mock\Http\Containers;

use App\Http\Containers\ConnectionContainer;
use PDOException;
use Exception;

trait ConnectionContainerMock
{
	private $connectionContainer;

	protected function mockConnectionContainer()
	{
		if ($this->connectionContainer === null) {
			$this->connectionContainer = $this->createMock(ConnectionContainer::class);
		}

		return $this->connectionContainer;
	}

	protected function stubConnectionContainerRedis($isConnected = true)
	{
		$mock = $this->mockConnectionContainer()->method('redis');

		if ($isConnected) {
			$mock->willReturn('connected');
		} else {
			$mock->willThrowException(new Exception());
		}

		return $this->connectionContainer;
	}

	private function dbClass()
	{
		return new class {
			private $isConnected;

			public function setPdo($isConnected)
			{
				$this->isConnected = $isConnected;
			}

			public function getPdo()
			{
				if ($this->isConnected) {
					return 'connected';
				} else {
					throw new PDOException('error');
				}
			}
		};
	}

	protected function stubConnectionContainerZirconDB($isConnected = true)
	{
		$dbClass = $this->dbClass();
		$dbClass->setPdo($isConnected);

		$this->mockConnectionContainer()
			->method('zirconDB')
			->willReturn($dbClass);

		return $this->connectionContainer;
	}

	protected function stubConnectionContainerMnlDB($isConnected = true)
	{
		$dbClass = $this->dbClass();
		$dbClass->setPdo($isConnected);

		$this->mockConnectionContainer()
			->method('mnlDB')
			->willReturn($dbClass);

		return $this->connectionContainer;
	}

	protected function stubConnectionContainerIomDB($isConnected = true)
	{
		$dbClass = $this->dbClass();
		$dbClass->setPdo($isConnected);

		$this->mockConnectionContainer()
			->method('iomDB')
			->willReturn($dbClass);

		return $this->connectionContainer;
	}
}
