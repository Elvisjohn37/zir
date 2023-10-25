<?php

namespace App\Exceptions;

use RuntimeException;
use App\Traits\ExceptionTrait;

class NotFoundException extends RuntimeException
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00025';
	public $status = '404';
}
