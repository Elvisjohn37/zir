<?php

namespace App\Models;

class ClientSession extends BaseModel
{
	protected $table = 'clientsession';
	protected $primaryKey = 'clientID';
	public $timestamps = false;
	protected $fillable = ['clientID'];

	public function scopeByClientID($query, $clientID)
	{
		return $query->where('clientID', '=', $clientID);
	}
}
