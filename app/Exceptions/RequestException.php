<?php

namespace App\Exceptions;

use UnexpectedValueException;
use App\Traits\ExceptionTrait;

class RequestException extends UnexpectedValueException
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00001';
	protected $data;

	public function __construct($errorMessage, $data = null)
	{
		$this->data = $data;
		parent::__construct($errorMessage);
	}
}
