<?php

namespace App\Http\Repositories;

use App\Models\Application;
use Config;

class AppRepository extends BaseRepository
{
	public function isMaintenance($applicationName = null)
	{
		$applicationName = empty($applicationName) ? Config::get('app.name') : $applicationName;

		$appMode = Application::select('mode')
			->where('applicationName', '=', $applicationName)
			->first()
			->value('mode');

		if ($appMode == 1) {
			return true;
		} else {
			return false;
		}
	}

	public function getRsoUrl()
	{
		$result = Application::select('externalUrl')
			->where('applicationName', 'RSO')
			->first();

		return empty($result) ? [] : $result->toArray();
	}

	public function getSboUrl()
	{
		$result = Application::select('externalUrl')
			->where('applicationName', 'SBO')
			->first();

		return empty($result) ? null : $result['externalUrl'];
	}

	public function getSboInfoCenterUrl()
	{
		$result = Application::select('externalUrl')
			->where('applicationName', 'SBO Information Center')
			->first();

		return empty($result) ? null : $result['externalUrl'];
	}

	public function getPsUrl()
	{
		$result = Application::select('externalUrl')
			->where('applicationName', 'Player Site')
			->first();

		return empty($result) ? null : $result['externalUrl'];
	}
}
