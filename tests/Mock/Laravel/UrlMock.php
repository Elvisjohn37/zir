<?php

namespace Tests\Mock\Laravel;

use URL;

trait UrlMock
{
	protected function stubUrlTo()
	{
		URL::shouldReceive('to')->andReturnArg(0);
	}
}
