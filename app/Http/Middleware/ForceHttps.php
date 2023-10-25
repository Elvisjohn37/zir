<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Config;
use URL;
use App\Http\Services\MobileSiteService;

class ForceHttps
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
		$mobileSiteService = new MobileSiteService();
        $isMobileSite = $mobileSiteService->isMobileSite();
        $isHttpsDesktop = !$isMobileSite && config::get('custom.site.isHttps');
        $isHttpsMobile = $isMobileSite && config::get('custom.mobile.isHttps');

        if($isHttpsDesktop || $isHttpsMobile) {
            URL::forceScheme('https');
        }

        return $next($request);
    }
}
