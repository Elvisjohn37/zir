<?php

namespace Tests\Mock\Http\Requests;

use App\Http\Requests\LoginReq;

trait LoginReqMock
{
	private $loginReq;

	protected function mockLoginReq()
	{
		if ($this->loginReq === null) {
			$this->loginReq = $this->createMock(LoginReq::class);
		}

		return $this->loginReq;
	}
}
