<?php
/*
|--------------------------------------------------------------------------
| helper functions
|--------------------------------------------------------------------------
| 
| Keep all functions in this area simple
| This will contain all generic functions that has no dependency with our framework
| 
*/

/**
 * This will mimic PHP ip2long and will convert it to non negative(unsigned)
 * Please read ip2long documentation, pending: add support to IPv6
 * @param  string $ip
 * @return number
 */
function unsigned_ip2long($ip)
{
	return sprintf('%u', ip2long($ip));
}

/**
 * Just like json_decode but will return the original value if it cannot be decoded
 * @param  string   $value
 * @param  boolean  $to_array
 * @return mixed
 */
function custom_json_decode($value, $to_array = false)
{
	if (is_string($value)) {
		$decoded_value = json_decode($value, $to_array);

		if (json_last_error() == JSON_ERROR_NONE) {
			$value = $decoded_value;
		}
	}

	return $value;
}

/**
 * remove subdomain
 * @param  string $host
 * @return string
 */
function removeSubdomain($host)
{
	$parsedUrl = parse_url($host);

	if (isset($parsedUrl['scheme'])) {
		$host = str_replace($parsedUrl['scheme'] . '://', '', $host);
	}

	$host_segments = explode('.', $host);
	$host_segments_length = sizeof($host_segments);

	if ($host_segments_length >= 3) {
		array_splice($host_segments, 0, 1);
	}

	return implode('.', $host_segments);
}

function replaceDomain($toReplace, $newHost, $token = 'DOMAIN')
{
	if (strpos($toReplace, '.' . $token . '.') !== false) {
		$host = removeSubdomain($newHost);
		$toReplaceScheme = parse_url($toReplace);
		$hostScheme = parse_url($newHost);
		$scheme = isset($hostScheme['scheme']) ? $hostScheme['scheme'] : 'http';

		if (isset($toReplaceScheme['host'])) {
			$scheme = isset($toReplaceScheme['scheme']) ? $toReplaceScheme['scheme'] : $scheme;
			$toReplaceHost = $toReplaceScheme['host'];
		} else {
			$toReplaceHost = $toReplaceScheme['path'];
			$scheme = 'http';
		}

		$toReplace = strstr($toReplace, $toReplaceHost);
		$hostRemovedSubdomain = strstr($toReplaceHost, $token);
		return $scheme . '://' . str_replace($hostRemovedSubdomain, $host, $toReplace);
	} else {
		return $toReplace;
	}
}

function generateToken($length)
{
	return substr(uniqid(mt_rand(), true), 0, $length);
}

function urlAddQuery($url, $url_params)
{
	if (strpos($url, '?') !== false) {
		return $url . '&' . http_build_query($url_params);
	} else {
		return $url . '?' . http_build_query($url_params);
	}
}

/**
 * Subtract date by given number
 * @param  string $date
 * @param  int $number
 * @return string       date subracted
 */
function previous_date($date, $number, $subtrac_in = 'days')
{
	$date = Carbon::parse($date);

	$carbon_method = 'sub' . ucwords(strtolower($subtrac_in));

	return $date->$carbon_method($number)->toDateTimeString();
}

/**
 * This will transform date to given format
 * @param  string $date
 * @param  string $format
 * @return object
 */
function customDateFormat($format, $date)
{
	return date($format, strtotime($date));
}

/**
 * This will get the latest last day of the month
 * If the month is not yet finish then this will get the current day
 * @param  string $date
 * @return object
 */
function month_last_day($date)
{
	$current_month = date('M');
	$date_month = date('M', strtotime($date));

	if ($current_month == $date_month) {
		return date('d');
	} else {
		return date('t', strtotime($date));
	}
}

/**
 * For formating money. Outputs two decimal places without rounding off
 *
 * @param  int   $number
 * @param  mixed $fallback_value  This will be the value if the given $number is not a number
 * @param  int   $options         [
 *                                    'fallback'                = (default) 0,
 *                                    'decimal_places'          = (default) 2,
 *                                    'original_decimal_places' = (default) none
 *                                                                best to put a value if decimal places is more than 6
 *                                ]
 * @return int
 */
function custom_money_format($number, $options = [])
{
	set_default($options, 'decimal_places', 2);
	set_default($options, 'decimal_delimeter', '.');
	set_default($options, 'original_decimal_places', 6);

	if (!is_numeric($number)) {
		$number = set_default($options, 'fallback', 0);
	}

	// handle scientific notations
	if (isset($options['original_decimal_places']) && is_numeric($options['original_decimal_places'])) {
		// convert scientific notations with precise decimal places
		$number = sprintf('%.' . $options['original_decimal_places'] . 'f', (string) $number);
	}

	if (is_numeric($number)) {
		$number_split = explode($options['decimal_delimeter'], $number);

		if (isset($number_split[1])) {
			$decimal = substr($number_split[1], 0, $options['decimal_places']);
		} else {
			$decimal = str_pad('', $options['decimal_places'], '0');
		}

		return number_format($number_split[0] . $options['decimal_delimeter'] . $decimal, $options['decimal_places']);
	} else {
		return $number;
	}
}
/**
 * This will set the default value of the object or array if index was not set
 * @param array/object &$subject      The object or array
 * @param string       $index         The index to be set
 * @param mixed        $default_value Default value
 */
function set_default(&$subject, $index, $default_value)
{
	if (!isset($subject[$index])) {
		$subject[$index] = is_callable($default_value) ? $default_value() : $default_value;
	}

	return $subject[$index];
}

function getLastSegment($string, $delimiter = '.', $segment_count = 1)
{
	$array = explode($delimiter, trim($string));

	$segments = [];

	for ($i = 0; $i < $segment_count; $i++) {
		if (count($array) > 0) {
			$segments[] = array_pop($array);
		} else {
			break;
		}
	}

	return implode($delimiter, array_reverse($segments));
}

function calculateDateTime($date, $formula, $format = 'Y-m-d H:i:s')
{
	return date($format, strtotime($formula, strtotime($date)));
}

function getArrayFromObject($obj, $key)
{
	$arr = [];
	foreach ($obj as $item) {
		array_push($arr, $item[$key]);
	}
	return $arr;
}

function isMobileDevice()
{
	return preg_match('/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i', $_SERVER['HTTP_USER_AGENT']) >
		0;
}

function getObjectArray($array, $key, $value)
{
	$newArray = [];

	foreach ($array as $arr) {
		if ($arr[$key] == $value) {
			array_push($newArray, $arr);
		}
	}

	return $newArray;
}

function get_ip()
{
	if (isset($_SERVER['HTTP_X_REAL_IP']) && !empty($_SERVER['HTTP_X_REAL_IP'])) {
		return $_SERVER['HTTP_X_REAL_IP'];
	}

	if (isset($_SERVER['HTTP_X_FORWARDED_FOR']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		return $_SERVER['HTTP_X_FORWARDED_FOR'];
	}

	return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : null;
}

function array_find_key($array, $closure)
{
	foreach ($array as $key => $value) {
		if ($closure($value, $key)) {
			return $key;
		}
	}

	return false;
}
