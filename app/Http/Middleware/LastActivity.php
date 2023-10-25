<?php

namespace App\Http\Middleware;

use Closure;
use Auth;
use App\Http\Services\SessionService;

class LastActivity
{
	private $sessionService;

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
			$this->sessionService->setLastActivity(Auth::user()->sboClientID);
		}

		return $next($request);
	}
}
