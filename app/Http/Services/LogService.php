<?php

namespace App\Http\Services;

use App\Externals\MonologFormatter\BaseFormatter;

class LogService extends BaseFormatter
{
	protected function addFormatter($fomattedLogArray)
	{
		$fomattedLogArray['ip'] = get_ip();

		return $fomattedLogArray;
	}
}
