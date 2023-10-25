<?php

namespace Tests\Mock\Laravel;

use Session;

trait SessionMock
{
	protected $sessionDriverStubbed = false;

	protected function stubSessionGetId($id = '123')
	{
		Session::driver()->setId($id);
	}
}
