<?php

namespace App\Models;

class GameSessionLog extends BaseModel
{
	protected $table = 'gamesessionlog';
	protected $primaryKey = 'gameSessionLogID';
	public $timestamps = false;
}
