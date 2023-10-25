<?php

namespace App\Http\Services;

class ClientStatusValidatorService
{
	public function isAllowedLogin($status)
	{
		return strtolower($status) == 'active' || strtolower($status) == 'suspended';
	}

	public function isAllowedToTransact($status)
	{
		return strtolower($status) == 'active';
	}
}
