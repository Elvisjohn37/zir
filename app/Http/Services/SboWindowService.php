<?php

namespace App\Http\Services;

use App\Http\Services\ZirconApiService;
use App\Externals\Aes\Custom\SboAes;
use App\Exceptions\UnauthorizedException;
use Str;
use Session;
use Config;
use URL;
use Auth;

class SboWindowService
{
	private function getUrlScheme()
	{
		$urlSchemeConfig = Config::get('custom.sbo.sboAsiWindowScheme');
		return empty($urlSchemeConfig) ? request()->getScheme() : $urlSchemeConfig;
	}

	private function getUrlHost($urlScheme, $subdomain)
	{
		$urlPath = Config::get('custom.sbo.sboAsiWindowPath');
		$sboReferrerDomain = Config::get('custom.sbo.sboReferrerDomain');
		if (empty($sboReferrerDomain)) {
			$sboReferrerDomain = Session::get('sboReferrerDomain');
			$host = rtrim(empty($sboReferrerDomain) ? URL::to('/') : $sboReferrerDomain, '/');
			$domainParse = parse_url($host);
			$host = empty($domainParse['port'])
				? $domainParse['host']
				: "{$domainParse['host']}:{$domainParse['port']}";
			$splitHost = explode('.', $host);
			$segmentLength = count($splitHost);
			$domain =
				$segmentLength > 1
					? $splitHost[$segmentLength - 2] . '.' . $splitHost[$segmentLength - 1]
					: $splitHost[0];
			return "{$urlScheme}://{$subdomain}.{$domain}{$urlPath}";
		} else {
			$urlPattern = "{$urlScheme}://{$subdomain}.DOMAIN.com{$urlPath}";
			return replaceDomain(
				$urlPattern,
				!empty($sboReferrerDomain) ? rtrim($sboReferrerDomain, '/') : URL::to('/')
			);
		}
	}

	private function getUrl()
	{
		$zirconApiService = new ZirconApiService();
		$subdomain = $zirconApiService->getProductSubdomain(Auth::user()->getLoginInfoID);

		if ($subdomain) {
			$urlScheme = $this->getUrlScheme();
			return $this->getUrlHost($urlScheme, $subdomain);
		} else {
			throw new UnauthorizedException(
				'ZirconApiService response false, check getProductSubdomain API request and response.'
			);
		}
	}

	private function commonPayload()
	{
		return [
			'customerID' => Auth::user()->sboClientID,
			'onlineID' => Session::get('sboSessionID'),
			'payloadID' => Str::uuid()->toString(),
		];
	}

	private function createUrl($addToUrlQuery = [])
	{
		$unEncryptedPayload = $this->commonPayload();
		$payloadToUrlQuery = http_build_query(array_merge($unEncryptedPayload, $addToUrlQuery));
		$sboAes = new SboAes();
		$encryptedPayload = $sboAes->encrypt($payloadToUrlQuery);
		return urlAddQuery($this->getUrl(), ['payload' => $encryptedPayload]);
	}

	public function balance()
	{
		return $this->createUrl(['page' => 'balance']);
	}

	public function limitAdjust()
	{
		return $this->createUrl(['page' => 'betting_budget']);
	}

	public function selfExclusion()
	{
		return $this->createUrl(['page' => 'self_exclusion']);
	}

	public function transferFunds()
	{
		return $this->createUrl(['page' => 'deposit']);
	}

	public function sports()
	{
		return $this->createUrl(['page' => 'sportsbook']);
	}
}
