<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;
use Illuminate\Contracts\Encryption\Encrypter as EncrypterContract;
use Config;

class EncryptCookies extends Middleware
{
	/**
	 * The names of the cookies that should not be encrypted.
	 *
	 * @var array
	 */
	protected $except = [];

	public function __construct(EncrypterContract $encrypter)
	{
		array_push($this->except, Config::get('custom.language.key'));
		parent::__construct($encrypter);
	}
}
