<?php

namespace App\Traits;

trait ExceptionTrait
{
	public function getStatusCode()
	{
		if (isset($this->status)) {
			return $this->status;
		} else {
			return '500';
		}
	}

	public function getData()
	{
		return isset($this->data) ? $this->data : [];
	}
}
