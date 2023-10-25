<?php

namespace App\Http\Middleware;

use App\Http\Services\MobileSiteService;
use Closure;
use Auth;
use Redirect;

class MobileBsiRedirect
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
		$mobileSiteService = new MobileSiteService();

		if (!Auth::check() && $mobileSiteService->isMobileSite()) {
			return Redirect::to($mobileSiteService->getSboMobileUrl());
		}

		return $next($request);
	}
}
