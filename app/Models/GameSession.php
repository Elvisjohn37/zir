<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class GameSession extends BaseModel
{
	use HasFactory;

	protected $table = 'gamesession';
	protected $primaryKey = 'gameSessionID';
	public $timestamps = false;

	public function scopeWhereGameID($query, $gameID)
	{
		return $query->where('gamesession.gameID', $gameID);
	}

	public function scopeWhereProductID($query, $productID)
	{
		return $query->where('gamesession.productID', $productID);
	}

	public function scopeGameID($query, $gameID)
	{
		return $query->where('gamesession.gameID', $gameID);
	}

	public function scopeProductID($query, $productID)
	{
		return $query->where('product.productID', $productID);
	}

	public function scopeMachineNameNull($query)
	{
		return $query->whereNull('gamesession.gameMachineName');
	}
}
