<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\EncryptionService;

trait EncryptionServiceMock
{
	private $encryptionService;

	protected function mockEncryptionService()
	{
		if ($this->encryptionService === null) {
			$this->encryptionService = $this->createMock(EncryptionService::class);
		}

		return $this->encryptionService;
	}

	protected function stubEncryptionServiceEncryptHashId()
	{
		$this->mockEncryptionService()
			->method('encryptHashId')
			->willReturnArgument(0);

		return $this->encryptionService;
	}
}
