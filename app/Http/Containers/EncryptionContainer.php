<?php

namespace App\Http\Containers;

use Vinkla\Hashids\Facades\Hashids;
use App\Externals\Aes\Custom\ZirconAes;
use App\Externals\Aes\Custom\SboAes;

class EncryptionContainer
{
	private $zirconAes;
	private $sboAes;

	public function __construct(ZirconAes $zirconAes, SboAes $sboAes)
	{
		$this->zirconAes = $zirconAes;
		$this->sboAes = $sboAes;
	}

	public function hashId()
	{
		return Hashids::connection();
	}

	public function aes($type = 'zircon')
	{
		switch ($type) {
			case 'sbo':
				return $this->sboAes;
			default:
				return $this->zirconAes;
		}
	}
}
