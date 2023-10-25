<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class Game extends Model
{
	use HasFactory;

	protected $table = 'game';
	protected $primaryKey = 'gameID';

	public function scopeIsMobile($query)
	{
		return $query->whereIn('game.device', [1, 2]);
	}

	public function scopeIsDesktop($query)
	{
		return $query->whereIn('game.device', [0, 2]);
	}

	public function scopeHasClientID($query, $clientID)
	{
		return $query->where('clientproduct.clientID', $clientID);
	}

	public function scopeTestModeDisbled($query)
	{
		return $query->where('game.isTestModeEnabled', 0);
	}

	public function scopeSelectIsNew($query)
	{
		return $query->addSelect(DB::raw('game.timestampReleased >= DATE_SUB(NOW(), INTERVAL 3 MONTH) AS isNew'));
	}

	public function scopeSelectIsAvailable($query)
	{
		return $query->addSelect(DB::raw('game.isTestModeEnabled = 0 AS isAvailable'));
	}

	public function scopeSelectAllowTestPlayer($query)
	{
		return $query->addSelect(DB::raw('1 AS isAvailable'));
	}

	public function scopeOrderByInterest($query)
	{
		return $query->orderBy('isNew', 'desc')->orderBy('game.gameName');
	}

	public function scopeProductID($query, $productID)
	{
		return $query->where('game.productID', $productID);
	}

	public function scopeOrderByTopGames($query, $order = 'ASC')
	{
		return $query->orderBy('game.rank', $order);
	}
}
