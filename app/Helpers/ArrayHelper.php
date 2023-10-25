<?php
namespace App\Helpers;

class ArrayHelper
{
	public function findKey($array, $closure)
	{
		foreach ($array as $key => $value) {
			if ($closure($value, $key)) {
				return $key;
			}
		}

		return false;
	}
}
