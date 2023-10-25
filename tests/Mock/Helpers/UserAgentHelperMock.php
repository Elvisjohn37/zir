<?php

namespace Tests\Mock\Helpers;

use App\Helpers\UserAgentHelper;

trait UserAgentHelperMock
{
	private $userAgentHelper;

	private $userAgentHelperReturnValues = [
		'getIp' => '10.2.2.1',
	];

	protected function mockUserAgentHelper()
	{
		if ($this->userAgentHelper === null) {
			$this->userAgentHelper = $this->createMock(UserAgentHelper::class);
		}

		return $this->userAgentHelper;
	}

	public function setUserAgentHelperReturnValues($returnValues)
	{
		$this->userAgentHelperReturnValues = array_replace($this->userAgentHelperReturnValues, $returnValues);
	}

	public function stubUserAgentHelperGetIp($returnValue = null)
	{
		if ($returnValue != null) {
			$this->userAgentHelperReturnValues['getIp'] = $returnValue;
		}

		$this->mockUserAgentHelper()
			->method('getIp')
			->will(
				$this->returnCallback(function () {
					return $this->userAgentHelperReturnValues['getIp'];
				})
			);

		return $this->userAgentHelper;
	}
}
