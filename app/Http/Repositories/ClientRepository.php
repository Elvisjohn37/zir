<?php

namespace App\Http\Repositories;

use App\Models\IpAccess;
use App\Models\CountryBlacklist;
use App\Models\GetLoginInfo;
use App\Models\TestPlayer;
use App\Models\Client;
use DB;
use Config;

class ClientRepository extends BaseRepository
{
	public function ipBlacklist($clientIP)
	{
		$clientIp2long = unsigned_ip2long($clientIP);
		$isIpBlocked = IpAccess::where('startRange', '<=', $clientIp2long)
			->where('endRange', '>=', $clientIp2long)
			->isBlacklisted()
			->first();

		if (!is_null($isIpBlocked)) {
			return true;
		}

		$isCountryBlocked = CountryBlacklist::join(
			'countryip',
			'countryip.countryIpID',
			'=',
			'countryblacklist.countryIpID'
		)
			->where('startRange', '<=', $clientIp2long)
			->where('endRange', '>=', $clientIp2long)
			->where('isEnabled', '=', 1)
			->first();

		if (!is_null($isCountryBlocked)) {
			return true;
		}

		return false;
	}

	public function createLoginLog($username, $clientIP)
	{
		$today = date('Y-m-d H:i:s');
		DB::table('loginlog')->insert([
			'ipAddress' => $clientIP,
			'timestampLogin' => $today,
			'username' => $username,
			'createdFromID' => Config::get('custom.login.createdFromID'),
			'timestampCreated' => $today,
		]);
	}

	public function updateLoginLog($usernames)
	{
		$updateQuery = DB::table('loginlog');

		if (is_array($usernames)) {
			$updateQuery = $updateQuery->whereIn('username', $usernames);
		} else {
			$updateQuery = $updateQuery->where('username', $usernames);
		}

		$updateQuery->whereNull('timestampLogout')->update(['timestampLogout' => date('Y-m-d H:i:s')]);
	}

	public function getClientUsername($getLoginInfoIds)
	{
		$clientUsername = GetLoginInfo::select('accountID');

		if (is_array($getLoginInfoIds)) {
			return $clientUsername
				->whereIn('getLoginInfoID', $getLoginInfoIds)
				->pluck('accountID')
				->toArray();
		} else {
			return $clientUsername->where('getLoginInfoID', $getLoginInfoIds)->value('accountID');
		}
	}

	public function isTestPlayer($sboCLientID)
	{
		return TestPlayer::where('isTestPlayer', 1)
			->where('sboClientID', $sboCLientID)
			->count() == 1;
	}

	public function getZirconClientID($sboClientID) {
		return Client::where('sboClientID', $sboClientID)->value('clientID');
	}
}
