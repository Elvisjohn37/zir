<?php

namespace App\Exceptions;

use Exception;
use Log;
use Illuminate\Support\MessageBag;
use App\Traits\ExceptionTrait;

class FormValidationException extends Exception
{
	use ExceptionTrait;

	public $errorCode = 'ERR_00023';
	public $status = '422';
	private $errorMessages;
	protected $data;

	public function __construct(MessageBag $errorMessages, $data = null)
	{
		$this->errorMessages = $errorMessages;
		$this->data = $data;
		parent::__construct($errorMessages);
	}

	public function report()
	{
		Log::notice($this->getMessage());
	}

	public function addResponse()
	{
		return ['formError' => $this->errorMessages->getMessages()];
	}
}
