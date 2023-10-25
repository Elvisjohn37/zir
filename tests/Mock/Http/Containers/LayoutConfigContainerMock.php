<?php

namespace Tests\Mock\Http\Containers;

use App\Http\Containers\LayoutConfigContainer;

trait LayoutConfigContainerMock
{
	private $layoutConfigContainer;

	protected function mockLayoutConfigContainer()
	{
		if ($this->layoutConfigContainer === null) {
			$this->layoutConfigContainer = $this->createMock(LayoutConfigContainer::class);
		}

		return $this->layoutConfigContainer;
	}

	private function appRepositoryClass()
	{
		return new class {
			private $returnValues = ['getSboUrl' => 'www.sbo.com', 'getSboInfoCenterUrl' => 'www.sbocenter.com'];

			public function set($returnValues)
			{
				$this->returnValues = array_replace($this->returnValues, $returnValues);
			}

			public function getSboUrl()
			{
				return $this->returnValues['getSboUrl'];
			}

			public function getSboInfoCenterUrl()
			{
				return $this->returnValues['getSboInfoCenterUrl'];
			}
		};
	}

	protected function stubLayoutConfigContainerAppRepository($returnValues = [])
	{
		$appRepositoryClass = $this->appRepositoryClass();
		$appRepositoryClass->set($returnValues);

		$this->mockLayoutConfigContainer()
			->method('appRepository')
			->willReturn($appRepositoryClass);

		return $this->layoutConfigContainer;
	}

	protected function stubLayoutConfigContainerGetLanguageConfig($returnValue = 'languageConfig')
	{
		$this->mockLayoutConfigContainer()
			->method('getLanguageConfig')
			->willReturn($returnValue);

		return $this->layoutConfigContainer;
	}

	private function mobileSiteServiceClass()
	{
		return new class {
			private $returnValues = ['isMobileSite' => 1];

			public function set($returnValues)
			{
				$this->returnValues = array_replace($this->returnValues, $returnValues);
			}

			public function isMobileSite()
			{
				return $this->returnValues['isMobileSite'];
			}
		};
	}

	protected function stubLayoutConfigContainerMobileSiteService($returnValues = [])
	{
		$mobileSiteServiceClass = $this->mobileSiteServiceClass();
		$mobileSiteServiceClass->set($returnValues);

		$this->mockLayoutConfigContainer()
			->method('mobileSiteService')
			->willReturn($mobileSiteServiceClass);

		return $this->layoutConfigContainer;
	}
}
