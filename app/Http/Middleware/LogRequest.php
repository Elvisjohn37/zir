<?php

namespace App\Http\Middleware;

use Closure;
use Log;
use Config;

class LogRequest
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
		$response = $next($request);

		if (Config::get('custom.logging.logApiRequest') !== 0) {
			Log::info('Request Log', ['response' => $response->getContent()]);
		}

		return $response;
	}
}
