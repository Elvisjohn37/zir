<?php

namespace Tests\Mock\Http\Repositories;

use App\Http\Repositories\AppRepository;

trait AppRepositoryMock
{
	private $appRepository;

	protected function mockAppRepository()
	{
		if ($this->appRepository === null) {
			$this->appRepository = $this->createMock(AppRepository::class);
		}

		return $this->appRepository;
	}

	protected function stubAppRepositoryGetSboInfoCenterUrl()
	{
		$this->mockAppRepository()
			->method('getSboInfoCenterUrl')
			->willReturn('www.sbo-center-sample.com');

		return $this->appRepository;
	}

	protected function stubAppRepositoryIsMaintenance($isMaintenance = false)
	{
		$this->mockAppRepository()
			->method('isMaintenance')
			->willReturn($isMaintenance);

		return $this->appRepository;
	}
}
