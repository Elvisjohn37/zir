<?php

namespace App\Exceptions;

use Exception;
use App\Traits\ExceptionTrait;

class RunningGameException extends Exception
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00027';
	public $status = '403';
	protected $data;

	public function __construct($errorMessage, $data = null, $errorDevice = null)
	{
		$this->data = $data;

		if (!empty($errorDevice)) {
			$this->errorCode = $errorDevice == 'mobile' ? 'ERR_00017' : 'ERR_00018';
		}

		parent::__construct($errorMessage);
	}

	public function addResponse()
	{
		return ['data' => $this->data];
	}
}
