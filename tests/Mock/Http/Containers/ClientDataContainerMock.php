<?php

namespace Tests\Mock\Http\Containers;

use App\Http\Containers\ClientDataContainer;

trait ClientDataContainerMock
{
	private $clientDataContainer;

	protected function mockClientDataContainer()
	{
		if ($this->clientDataContainer === null) {
			$this->clientDataContainer = $this->createMock(ClientDataContainer::class);
		}

		return $this->clientDataContainer;
	}

	protected function stubClientDataContainerClientRepository($serviceClass)
	{
		if ($serviceClass == null) {
			$serviceClass = $this->mockClientRepository();
		}

		$this->mockClientDataContainer()
			->method('clientRepository')
			->willReturn($serviceClass);

		return $this->clientDataContainer;
	}

	protected function stubClientDataContainerClientIpBlackList($returnValue = false)
	{
		$this->mockClientDataContainer()
			->method('clientIpBlackList')
			->willReturn($returnValue);

		return $this->clientDataContainer;
	}

	protected function stubClientDataContainerZirconApiService($serviceClass = null)
	{
		if ($serviceClass == null) {
			$serviceClass = $this->mockZirconApiService();
		}

		$this->mockClientDataContainer()
			->method('zirconApiService')
			->willReturn($serviceClass);

		return $this->clientDataContainer;
	}

	protected function stubClientDataContainerLogoutService($serviceClass = null)
	{
		if ($serviceClass == null) {
			$serviceClass = $this->mockLogoutService();
		}

		$this->mockClientDataContainer()
			->method('logoutService')
			->willReturn($serviceClass);

		return $this->clientDataContainer;
	}

	protected function stubClientDataContainerSessionService($serviceClass = null)
	{
		if ($serviceClass == null) {
			$serviceClass = $this->mockSessionService();
		}

		$this->mockClientDataContainer()
			->method('sessionService')
			->willReturn($serviceClass);

		return $this->clientDataContainer;
	}

	protected function stubClientDataContainerUserAgentHelper($serviceClass = null)
	{
		if ($serviceClass == null) {
			$serviceClass = $this->mockUserAgentHelper();
		}

		$this->mockClientDataContainer()
			->method('userAgentHelper')
			->willReturn($serviceClass);

		return $this->clientDataContainer;
	}
}
