<?php

namespace Tests\Mock\Helpers;

use App\Helpers\UtilsHelper;

trait UtilsHelperMock
{
	private $utilsHelper;

	protected function mockUtilsHelper()
	{
		if ($this->utilsHelper === null) {
			$this->utilsHelper = $this->createMock(UtilsHelper::class);
		}

		return $this->utilsHelper;
	}

	protected function stubUtilsHelperArrayFindKey()
	{
		$this->mockUtilsHelper()
			->method('arrayFindKey')
			->will(
				$this->returnCallback(function ($array, $closure) {
					foreach ($array as $key => $value) {
						if ($closure($value, $key)) {
							return $key;
						}
					}

					return false;
				})
			);

		return $this->utilsHelper;
	}
}
