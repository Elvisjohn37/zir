<?php
namespace App\Http\Services;

use Illuminate\Support\Facades\Redis;
use App\Helpers\DateHelper;
use Session;
use Config;
use Auth;
use DateTime;

class SessionService
{
	private $dateHelper;

	public function __construct(DateHelper $dateHelper) {
		$this->dateHelper = $dateHelper;
	}

	private function clientSessionKey()
	{
		return Config::get('cache.prefix') . ':clientsession';
	}

	private function getLoginInfoKey()
	{
		return Config::get('cache.prefix') . ':getlogininfo';
	}

	private function getlastActivityKey()
	{
		return Config::get('cache.prefix') . ':lastactivity';
	}

	public function setLoginSessions($loginDetail)
	{
		Redis::hSet($this->clientSessionKey(), $loginDetail['clientID'], Session::getId());
		Redis::hSet($this->getLoginInfoKey(), $loginDetail['clientID'], $loginDetail['referenceID']);

		Session::put('clientID', $loginDetail['clientID']);
		Session::put('sboReferrerDomain', request()->headers->get('referer'));

		$this->setLastActivity($loginDetail['clientID']);
	}

	public function logoutOwnSessions()
	{
		$clientID = Auth::user()->clientID;
		$cacheSessionID = Redis::hGet($this->clientSessionKey(), $clientID);
		$isSessionAffected = 0;

		if ($cacheSessionID == Session::getId()) {
			$this->logoutClientID($clientID);
		}

		Auth::logout();
		Session::regenerate();

		return $isSessionAffected;
	}

	public function getClientID()
	{
		return Session::get('clientID');
	}

	public function logoutAllSessions()
	{
		Redis::del($this->getLoginInfoKey());
		Redis::del($this->getlastActivityKey());
		return Redis::del($this->clientSessionKey());
	}

	public function logoutClientID($clientIDs)
	{
		if (is_array($clientIDs)) {
			Redis::hDel($this->getLoginInfoKey(), ...$clientIDs);
			Redis::hDel($this->getlastActivityKey(), ...$clientIDs);
			return Redis::hDel($this->clientSessionKey(), ...$clientIDs) > 0;
		} else {
			Redis::hDel($this->getLoginInfoKey(), $clientIDs);
			Redis::hDel($this->getlastActivityKey(), $clientIDs);
			return Redis::hDel($this->clientSessionKey(), $clientIDs) > 0;
		}
	}

	public function isClientLogin($clientID)
	{
		return Redis::hGet($this->clientSessionKey(), $clientID) != false;
	}

	public function getAllLoginClientID()
	{
		return array_keys(Redis::hGetAll($this->clientSessionKey()));
	}

	public function getLoginInfoReferenceID($clientIDs)
	{
		if (is_array($clientIDs)) {
			return Redis::hmget($this->getLoginInfoKey(), $clientIDs);
		} else {
			return Redis::hGet($this->getLoginInfoKey(), $clientIDs);
		}
	}

	public function setLastActivity($clientID, $force = true) {
		$lastActivity = date('Y-m-d H:i:s');

		if($force || $this->isClientLogin($clientID)) {
			Redis::hSet($this->getlastActivityKey(),$clientID, $lastActivity);
		}

		return $lastActivity;
	}

	public function getAllInactiveClientIDs() {
		$lastActivities = Redis::hGetAll($this->getlastActivityKey());
		$idleTimeOut = Config::get('custom.login.inActive');
		$now = new DateTime();
		$inactiveClientIDs=[];
		
		foreach($lastActivities as $clientID => $lastActivities) {
			$lastActivityDateObj = new DateTime($lastActivities);
			$minutePassed = $this->dateHelper->diffMinutes($lastActivityDateObj, $now);

			if($minutePassed >= $idleTimeOut) {
				array_push($inactiveClientIDs, $clientID);
			}
		}

		return $inactiveClientIDs;
	}
}
