<?php

namespace App\Exceptions;

use RuntimeException;
use App\Traits\ExceptionTrait;

class UnauthorizedException extends RuntimeException
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00026';
	public $status = '401';
	protected $data;

	public function __construct($errorMessage, $data = null)
	{
		$this->data = $data;
		parent::__construct($errorMessage);
	}
}
