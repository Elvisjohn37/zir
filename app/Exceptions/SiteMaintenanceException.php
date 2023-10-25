<?php

namespace App\Exceptions;

use RuntimeException;
use App\Traits\ExceptionTrait;

class SiteMaintenanceException extends RuntimeException
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00029';
	public $status = '403';
	protected $data;

	public function __construct($errorMessage, $data = null)
	{
		$this->data = $data;
		parent::__construct($errorMessage);
	}
}
