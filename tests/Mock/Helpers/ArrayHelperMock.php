<?php

namespace Tests\Mock\Helpers;

use App\Helpers\ArrayHelper;

trait ArrayHelperMock
{
	private $arrayHelper;

	protected function mockArrayHelper()
	{
		if ($this->arrayHelper === null) {
			$this->arrayHelper = $this->createMock(ArrayHelper::class);
		}

		return $this->arrayHelper;
	}

	protected function stubArrayHelperFindKey()
	{
		$this->mockArrayHelper()
			->method('findKey')
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

		return $this->arrayHelper;
	}
}
