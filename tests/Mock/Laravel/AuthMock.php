<?php

namespace Tests\Mock\Laravel;

use Auth;

trait AuthMock
{
	protected $users = [
		'123' => ['clientID' => '123', 'currencyID' => '1', 'isTestPlayer' => '1', 'username' => 'user123'],
		'234' => ['clientID' => '234', 'currencyID' => '2', 'isTestPlayer' => '0', 'username' => 'user234'],
	];

	protected $currentUser = null;

	protected function stubAuthUser($user = null)
	{
		if ($user !== null) {
			Auth::shouldReceive('user')->andReturn((object) $user);
		} else {
			Auth::shouldReceive('user')->andReturnUsing(function () {
				return $this->authGetUser($this->currentUser);
			});
		}
	}

	protected function authGetUser($id)
	{
		return (object) $this->users[$id];
	}

	protected function stubAuthCheck($isLogin = null)
	{
		if ($isLogin !== null) {
			Auth::shouldReceive('check')->andReturn($isLogin);
		} else {
			Auth::shouldReceive('check')->andReturnUsing(function () {
				return $this->currentUser !== null && isset($this->users[$this->currentUser]);
			});
		}
	}

	protected function stubAuthUserDefault()
	{
		$this->authLoginUser('123');
	}

	protected function authLoginUser($id)
	{
		$this->stubAuthCheck();
		$this->stubAuthUser();
		$this->stubAuthLoginUsingId();
		Auth::loginUsingId($id);
	}

	protected function stubAuthLoginUsingId()
	{
		Auth::shouldReceive('loginUsingId')->andReturnUsing(function ($id) {
			$this->currentUser = $id;
		});
	}
}
