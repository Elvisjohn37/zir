<?php

namespace Tests\Mock\Http\Containers;

use App\Http\Containers\EncryptionContainer;

trait EncryptionContainerMock
{
	private $encryptionContainer;

	protected function mockEncryptionContainer()
	{
		if ($this->encryptionContainer === null) {
			$this->encryptionContainer = $this->createMock(EncryptionContainer::class);
		}

		return $this->encryptionContainer;
	}

	private function hashIdClass()
	{
		return new class {
			public function encode($toEncrypt)
			{
				return $toEncrypt;
			}
		};
	}

	protected function stubEncryptionContainerHashId()
	{
		$this->mockEncryptionContainer()
			->method('hashId')
			->willReturn($this->hashIdClass());

		return $this->encryptionContainer;
	}
}
