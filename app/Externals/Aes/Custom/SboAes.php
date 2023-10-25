<?php

namespace App\Externals\Aes\Custom;

use App\Externals\Aes\BaseAes;

class SboAes extends BaseAes
{
	protected $password_key = 'secret_password';

	protected $time_zone_string = 'UTC';

	protected function generate_key($entrophy)
	{
		return md5("{$entrophy}{$this->password_key}");
	}
}
