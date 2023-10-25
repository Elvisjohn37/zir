<?php

namespace Tests\Mock\Http\Containers;

use App\Http\Containers\ClientConfigContainer;

trait ClientConfigContainerMock
{
	private $clientConfigContainer;

	protected function mockClientConfigContainer()
	{
		if ($this->clientConfigContainer === null) {
			$this->clientConfigContainer = $this->createMock(ClientConfigContainer::class);
		}

		return $this->clientConfigContainer;
	}

	protected function stubClientConfigContainerMobileSiteService($serviceClass = null)
	{
		if ($serviceClass == null) {
			$serviceClass = $this->mockMobileSiteService();
		}

		$this->mockClientConfigContainer()
			->method('mobileSiteService')
			->willReturn($serviceClass);

		return $this->clientConfigContainer;
	}

	protected function stubClientConfigContainerLanguageService($serviceClass = null)
	{
		if ($serviceClass == null) {
			$serviceClass = $this->mockLanguageService();
		}

		$this->mockClientConfigContainer()
			->method('languageService')
			->willReturn($serviceClass);

		return $this->clientConfigContainer;
	}
}
