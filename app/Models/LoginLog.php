<?php

namespace App\Models;

class LoginLog extends BaseModel
{
	protected $table = 'loginlog';
	protected $primaryKey = 'loginLogID';
	public $timestamps = false;
	protected $fillable = ['loginLogID'];

	public function scopeByUsername($query, $username)
	{
		return $query->where('username', '=', $username);
	}
}
