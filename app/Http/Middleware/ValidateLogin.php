<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Redis;
use App\Http\Services\SessionService;
use App\Exceptions\UnauthorizedException;
use App\Exceptions\SessionException;
use Session;
use Closure;
use Auth;
use Config;

class ValidateLogin
{
	public $sessionService;

	public function __construct(SessionService $sessionService)
	{
		$this->sessionService = $sessionService;
	}

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		if (Auth::check()) {
			$clientID = $this->sessionService->getClientID();
			$cacheSessionID = Redis::hGet(Config::get('cache.prefix') . ':clientsession', $clientID);

			if ($cacheSessionID == Session::getId()) {
				return $next($request);
			} else {
				$this->sessionService->logoutOwnSessions();
			}

			throw new SessionException('Session ID does not match');
		}

		throw new UnauthorizedException('Unauthorized access to routes that is for logged in users only');
	}
}
