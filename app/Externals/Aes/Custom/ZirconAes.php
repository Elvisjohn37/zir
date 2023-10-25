<?php

namespace App\Externals\Aes\Custom;

use App\Externals\Aes\BaseAes;

class ZirconAes extends BaseAes
{
	protected $password_key = 'DAwMDAwMDAwMDAwMDAwMDGEO1DHRPNG8ifX5v6tn9Rk=';

	protected function generate_key($entrophy)
	{
		return md5("{$entrophy}{$this->password_key}");
	}
}
