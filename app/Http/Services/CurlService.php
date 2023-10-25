<?php

namespace App\Http\Services;

use App\Exceptions\RequestException;

class CurlService
{
	public function request($url, $params = [], $curl_setopt_array = [])
	{
		$ch = curl_init();
		$curl_setopt_array['CUSTOPT_METHOD'] = isset($curl_setopt_array['CUSTOPT_METHOD'])
			? $curl_setopt_array['CUSTOPT_METHOD']
			: 'post';

		// default options
		curl_setopt($ch, CURLOPT_URL, $url);

		if ($curl_setopt_array['CUSTOPT_METHOD'] != 'get') {
			curl_setopt($ch, CURLOPT_POST, count($params));
			curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
		}
		unset($curl_setopt_array['CUSTOPT_METHOD']);
		unset($curl_setopt_array[CURLOPT_POST]);
		unset($curl_setopt_array[CURLOPT_POSTFIELDS]);

		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

		// add/overwrite default
		if (is_array($curl_setopt_array) && count($curl_setopt_array) > 0) {
			curl_setopt_array($ch, $curl_setopt_array);
		}

		$response = curl_exec($ch);
		$errorNumber = curl_errno($ch);
		$errorMessage = curl_error($ch);

		curl_close($ch);

		if ($errorNumber == 0) {
			$content = custom_json_decode($response, true);

			if ($content === null) {
				$content = $response;
			}

			return $content;
		} else {
			throw new RequestException('Curl response error', [
				'url' => $url,
				'params' => $params,
				'message' => $errorMessage,
				'response' => $response,
			]);
		}
	}
}
