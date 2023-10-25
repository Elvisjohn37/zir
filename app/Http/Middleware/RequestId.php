<?php

namespace App\Http\Middleware;

use Closure;

class RequestId
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		$request->requestID = uniqid();
		return $next($request);
	}
}
