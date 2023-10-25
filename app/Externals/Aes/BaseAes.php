<?php

namespace App\Externals\Aes;

use DateTime;
use DateTimeZone;

/**
 * @version  2.0.0
 */
class BaseAes
{
	protected $padding = 0;

	protected $no_expire_padding = 'AAAAAAAAAAAAAAAAAAAA';

	protected $block = 16;

	protected $iv_length;

	protected $cipher = 'AES-256-CFB';

	protected $password_key = 'AAecoKv0stHMs3x*%E*AJ4do32Eo1iJO';

	protected $entropy = 2016;

	protected $time_zone_string = 'Asia/Manila';

	protected $time_zone;

	protected $minutes_valid = 3;

	public function __construct()
	{
		$this->time_zone = new DateTimeZone($this->time_zone_string);
		$this->iv_length = openssl_cipher_iv_length($this->cipher);
	}

	protected function generate_key($entrophy)
	{
		return md5("{$entrophy}|{$this->password_key}");
	}

	protected function generate_time($interval = 0)
	{
		$date_time = new DateTime('r', $this->time_zone);
		return $date_time->modify("-{$interval} seconds")->format('mdYHi');
	}

	protected function noexpire_key()
	{
		return $this->generate_key($this->entropy);
	}

	protected function withexpire_key()
	{
		return $this->generate_key($this->generate_time());
	}

	public function withexpire_decryption_keys()
	{
		$keys = [];

		for ($count = 1; $count <= $this->minutes_valid; $count++) {
			$interval = ($count - 1) * 60;
			$time = $this->generate_time($interval);
			array_push($keys, $this->generate_key($time));
		}

		return $keys;
	}

	protected function to_valid_block($to_encrypt)
	{
		$bytes = strlen($to_encrypt);
		$bitmod = $bytes % $this->block;
		if ($bitmod > 0) {
			$bitmis = $this->block - $bitmod;
			$block = $bytes + $bitmis;

			$padding = $block * 2;
			$hexval = bin2hex($to_encrypt);

			$hexpad = str_pad($hexval, $padding, $this->padding);
			$to_encrypt = $this->hex2bin($hexpad);
		}

		return $to_encrypt;
	}

	protected function generate_iv($no_expire)
	{
		$mix = $no_expire ? $this->padding : mt_rand(0, $this->iv_length - 1);

		$bytes = [];
		for ($i = 0; $i <= 15; $i++) {
			array_push($bytes, $mix);
		}

		return call_user_func_array('pack', array_merge(['c*'], $bytes));
	}

	/**
	 *
	 * Encrypts data with AES/CFB/ZERO_PADDING using openssl
	 * Since openssl doesn't support ZERO_PADDING,
	 * this class must do the padding manually.
	 * http://en.wikipedia.org/wiki/Padding_(cryptography)
	 *
	 * @param  string 	$to_encrypt 	Data to be encrypted
	 * @param  boolean 	$no_expire 	Set to:
	 *                              true => without expiry (ex. for client_id's)
	 *                              false => encrypted data has a validity of 3 minutes
	 *                                  	 (ex. for payloads)
	 *
	 * @return string 	$encode
	 */
	public function encrypt($to_encrypt = '', $no_expire = false)
	{
		if ($no_expire == true) {
			$encyption_key = $this->noexpire_key();
		} else {
			$encyption_key = $this->withexpire_key();
		}

		$to_encrypt = $this->to_valid_block($to_encrypt);

		// Initialization Vector (IV)
		$iv = $this->generate_iv($no_expire);

		// Encryption
		$encrypt = openssl_encrypt($to_encrypt, $this->cipher, $encyption_key, OPENSSL_NO_PADDING, $iv);
		$encode = base64_encode($iv . $encrypt);

		if ($no_expire === true) {
			$encode = str_replace($this->no_expire_padding, '', $encode);
		}

		return $encode;
	}

	/**
	 *
	 * Decrypts data with AES/CFB/ZERO_PADDING using openssl
	 *
	 * @param  string   $to_decrypt   Encrypted data
	 * @param  integer  $count       Count of expected data to be decoded
	 *                               (ex. for query params: url=32&sampl=3 has a count value of 2)
	 *                               (ex. for normal strings: 20001 has a count value of 0)
	 * @param  boolean 	$no_expire 	 Set to:
	 *                               true => without expiry (ex. for client_id's)
	 *                               false => encrypted data has a validity of 3 minutes
	 *                                  	  (ex. for payloads)
	 *
	 * @return string 	$decode
	 */
	public function decrypt($to_decrypt = '', $count = 1, $no_expire = false)
	{
		if ($no_expire === true) {
			$to_decrypt = $this->no_expire_padding . $to_decrypt;
		}

		$decode = base64_decode($to_decrypt);

		// Get the first 16 bytes as Initialization Vector (IV),
		// while the other left will be treated as the encrypted data.
		$decode_iv = substr($decode, 0, $this->iv_length);
		$decode_en = str_replace($decode_iv, '', $decode);

		if (strlen($decode_en) >= $this->block) {
			$decode = null;

			if ($no_expire === true) {
				$encyption_key = $this->noexpire_key();

				$decode = openssl_decrypt($decode_en, $this->cipher, $encyption_key, OPENSSL_NO_PADDING, $decode_iv);
			} else {
				$key_num = 0;
				$data = [];
				$decryption_keys = $this->withexpire_decryption_keys();
				$decryption_keys_length = count($decryption_keys);

				while (count($data) != $count && $key_num < $decryption_keys_length) {
					$decryption_key = $decryption_keys[$key_num];

					$decode = openssl_decrypt(
						$decode_en,
						$this->cipher,
						$decryption_key,
						OPENSSL_NO_PADDING,
						$decode_iv
					);
					$data = explode('&', $decode);

					$key_num++;
				}
			}

			return trim($decode);
		} else {
			trigger_error("Cannot decrypt value '{$to_decrypt}'");
		}
	}

	protected function hex2bin($string)
	{
		$bin = '';
		$len = strlen($string);

		for ($i = 0; $i < $len; $i += 2) {
			$bin .= pack('H*', substr($string, $i, 2));
		}

		return $bin;
	}
}
