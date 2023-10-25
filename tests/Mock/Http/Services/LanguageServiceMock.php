<?php

namespace Tests\Mock\Http\Services;

use App\Http\Services\LanguageService;

trait LanguageServiceMock
{
	private $languageService;

	private $languageServiceReturnValues = [
		'setFromSbo' => null,
	];

	protected function mockLanguageService()
	{
		if ($this->languageService === null) {
			$this->languageService = $this->createMock(LanguageService::class);
		}

		return $this->languageService;
	}

	public function setLanguageServiceReturnValues($returnValues)
	{
		$this->languageServiceReturnValues = array_replace($this->languageServiceReturnValues, $returnValues);
	}

	public function stubLanguageServiceSetFromSbo()
	{
		$this->mockLanguageService()
			->method('setFromSbo')
			->will(
				$this->returnCallback(function ($language) {
					return $this->languageServiceReturnValues['setFromSbo'] == null
						? $language
						: $this->languageServiceReturnValues['setFromSbo'];
				})
			);

		return $this->languageService;
	}
}
