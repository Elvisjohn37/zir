<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticate;

class ClientProvider extends Authenticate
{
	protected $table = 'getlogininfo';
	protected $primaryKey = 'getLoginInfoID';
	public $timestamps = false;
}
