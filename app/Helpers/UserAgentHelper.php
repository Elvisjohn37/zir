<?php
namespace App\Helpers;

class UserAgentHelper
{
	public function isMobileDevice()
	{
		return preg_match(
			'/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i',
			$_SERVER['HTTP_USER_AGENT']
		) > 0;
	}

	function getIp()
	{
		if (isset($_SERVER['HTTP_X_REAL_IP']) && !empty($_SERVER['HTTP_X_REAL_IP'])) {
			return $_SERVER['HTTP_X_REAL_IP'];
		}

		if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			return $_SERVER['HTTP_X_FORWARDED_FOR'];
		}

		return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : null;
	}
}
