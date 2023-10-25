<?php

namespace Tests\Mock\Laravel;

use Redirect;

trait RedirectMock
{
	protected function stubRedirectTo()
	{
		Redirect::shouldReceive('to')->andReturnUsing(function ($to) {
			return 'redirectto' . $to;
		});
	}
}
