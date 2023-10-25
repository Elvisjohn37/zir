<?php
namespace App\Helpers;

class UtilsHelper
{
	public function arrayFindKey($array, $closure)
	{
		foreach ($array as $key => $value) {
			if ($closure($value, $key)) {
				return $key;
			}
		}

		return false;
	}
}
