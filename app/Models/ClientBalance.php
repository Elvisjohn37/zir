<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DB;

class ClientBalance extends Model
{
    use HasFactory;

    protected $table = "clientbalance";

    public function scopeGetClientID($query, $clientID) {
        return $query->where('clientbalance.clientID', $clientID);
    }

    public function scopeIsLogin($query) {
        return $query->where('clientsession._isLogin', 1);
    }
}
