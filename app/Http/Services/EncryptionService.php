<?php

namespace App\Http\Services;

use Vinkla\Hashids\Facades\Hashids;
use App\Externals\Aes\Custom\ZirconAes;

class EncryptionService
{
	private $zirconAes;

	public function __construct(ZirconAes $zirconAes)
	{
		$this->zirconAes = $zirconAes;
	}

	public function encryptHashId($toEncrypt)
	{
		return Hashids::encode($toEncrypt);
	}

	public function decryptHashId($toDecrypt)
	{
		return Hashids::decode($toDecrypt)[0];
	}

	public function encryptZirconAes($to_encrypt = '', $no_expire = false)
	{
		return $this->zirconAes->encrypt($to_encrypt, $no_expire);
	}

	public function decryptZirconAes($to_decrypt = '', $count = 1, $no_expire = false)
	{
		return $this->zirconAes->decrypt($to_decrypt, $count, $no_expire);
	}
}
