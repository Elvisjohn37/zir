<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
	use HasFactory;

	protected $table = 'client';

	public function scopeTestModeDisbled($query)
	{
		return $query->where('game.isTestModeEnabled', 0);
	}

	public function scopeIsNotTestPlayer($query)
	{
		return $query->where('client.isTestPlayer', 0);
	}
}
