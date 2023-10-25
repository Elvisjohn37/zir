<?php

namespace App\Exceptions;

use Exception;
use App\Traits\ExceptionTrait;

class GameRestrictionException extends Exception
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00014';
	public $status = '403';
	protected $data;

	public function __construct($errorMessage, $data = null)
	{
		$this->data = $data;
		parent::__construct($errorMessage);
	}

	public function addResponse()
	{
		return ['data' => $this->data];
	}
}
