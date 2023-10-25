<?php
namespace App\Http\Services;

use App\Http\Services\CurlService;
use Config;
use App\Exceptions\RequestException;
use App\Exceptions\SiteMaintenanceException;
use URL;
use Log;

class ZirconApiService
{
	private function adapterApiCurl($path, $params = [], $curl_setopt_array = [], $isSuppressed = false)
	{
		$url = replaceDomain(Config::get('custom.api.adapterApiUrl'), URL::to('/')) . $path;
		$curl_setopt_array[CURLOPT_TIMEOUT] = Config::get('custom.api.adapterApiTimeout');
		return $this->apiCurl($url, $params, $curl_setopt_array, $isSuppressed);
	}

	private function adminApiCurl($path, $params = [], $curl_setopt_array = [], $isSuppressed = false)
	{
		$url = replaceDomain(Config::get('custom.api.adminApiUrl'), URL::to('/')) . $path;
		$curl_setopt_array[CURLOPT_TIMEOUT] = Config::get('custom.api.adminApiTimeout');
		return $this->apiCurl($url, $params, $curl_setopt_array, $isSuppressed);
	}

	private function gameApiCurl($path, $params = [], $curl_setopt_array = [], $isSuppressed = false)
	{
		$url = replaceDomain(Config::get('custom.api.gameApiUrl'), URL::to('/')) . $path;
		$curl_setopt_array[CURLOPT_TIMEOUT] = Config::get('custom.api.gameApiTimeout');
		return $this->apiCurl($url, $params, $curl_setopt_array, $isSuppressed);
	}

	private function apiCurl($url, $params = [], $curl_setopt_array = [], $isSuppressed = false)
	{
		$curlService = new CurlService();
		$apiCurl = $curlService->request($url, $params, $curl_setopt_array);

		if (is_array($apiCurl) && isset($apiCurl['error']) && $apiCurl['error']['code'] === 201) {
			throw new SiteMaintenanceException('System Under Maintenance', [
				'url' => $url,
				'params' => $params,
				'response' => $apiCurl,
			]);
		}

		if (is_array($apiCurl) && isset($apiCurl['error']) && $apiCurl['error']['code'] == 0) {
			return $apiCurl;
		} else {
			if ($isSuppressed) {
				Log::error('Logout API error(supressed)', [
					'exception' => [
						'url' => $url,
						'params' => $params,
						'response' => $apiCurl,
					],
				]);
			} else {
				throw new RequestException('API response error', [
					'url' => $url,
					'params' => $params,
					'response' => $apiCurl,
				]);
			}
		}
	}

	public function getLoginDetail($token)
	{
		//** This will return false if error from API */
		return $this->adapterApiCurl('/ps/login', ['token' => $token])['data'];
	}

	public function logout($clientID, $isSuppressed = false)
	{
		return $this->adapterApiCurl('/ps/logout', ['referenceID' => $clientID], [], $isSuppressed);
	}

	public function getProductSubdomain($referenceID)
	{
		return $this->adapterApiCurl('/ps/sportsurl', ['referenceID' => $referenceID])['data']['url'];
	}

	public function eyeconBetDetails($payload)
	{
		return $this->gameApiCurl('/eyecon/getbetdetail', ['payload' => $payload]);
	}

	public function funkyBetDetails($payload)
	{
		return $this->gameApiCurl('/funky/getbetdetail', ['payload' => $payload]);
	}

	public function settleRunningGame($sboClientID)
	{
		return $this->adapterApiCurl('/ps/autosettle', ['clientID' => $sboClientID]);
	}

	public function getMobileLoginDetail($token)
	{
		return $this->adapterApiCurl('/ps/m/login', ['token' => $token])['data'];
	}

	public function getBalance($getLoginInfoID)
	{
		return $this->adapterApiCurl('/ps/getbalance', ['referenceID' => $getLoginInfoID]);
	}
}
