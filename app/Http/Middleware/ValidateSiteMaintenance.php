<?php

namespace App\Http\Middleware;

use App\Exceptions\SiteMaintenanceException;
use Closure;
use Auth;
use App\Http\Repositories\AppRepository;

class ValidateSiteMaintenance
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
		$appRepository = new AppRepository();
		if($appRepository->isMaintenance()) {
			if(Auth::check()) {
				throw new SiteMaintenanceException('Site maintenance and player is logged in');
			} else {
				throw new SiteMaintenanceException('Site maintenance and player is not logged in');
			}
		}
		
		return $next($request);
	}
}
