<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameConfig extends Model
{
	use HasFactory;

	protected $table = 'gameconfig';

	public function scopeGetConfigName($query, $configName)
	{
		return $query->where('gameconfig.configName', $configName);
	}

	public function scopeGameID($query, $gameID)
	{
		return $query->where('gameconfig.gameID', $gameID);
	}
}
