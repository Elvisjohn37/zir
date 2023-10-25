<?php

namespace App\Exceptions;

use Exception;
use App\Traits\ExceptionTrait;

class GameCurrencyException extends Exception
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00034';
	public $status = '403';
	protected $data;

	public function __construct($errorMessage, $data = null)
	{
		$this->data = $data;
		parent::__construct($errorMessage);
	}
}
