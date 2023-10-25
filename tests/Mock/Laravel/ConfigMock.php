<?php

namespace Tests\Mock\Laravel;

use Config;

trait ConfigMock
{
	protected function stubConfig($configs)
	{
		foreach ($configs as $key => $value) {
			Config::set($key, $value);
		}
	}
}
