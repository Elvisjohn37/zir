<?php

namespace App\Http\Services;

use Auth;

class ClientConvertService
{
	public function isWalkin()
	{
		return Auth::user()->isWalkin ? 1 : 0;
	}

	public function jurisdiction()
	{
		switch (Auth::user()->jurisdictionCode) {
			case 'PHL':
				return 'MNL';
			case 'IMN':
				return 'IOM';
		}
	}
}
