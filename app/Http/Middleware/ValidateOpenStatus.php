<?php

namespace App\Http\Middleware;

use App\Exceptions\GameRestrictionException;
use Closure;
use Auth;
use App\Http\Services\ClientStatusValidatorService;

class ValidateOpenStatus
{
	private $clientStatusValidatorService;

	public function __construct(ClientStatusValidatorService $clientStatusValidatorService) {
		$this->clientStatusValidatorService =  $clientStatusValidatorService;
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
			if (!$this->clientStatusValidatorService->isAllowedToTransact(Auth::user()->clientGlobalStatus)) {
				throw new GameRestrictionException('Client status is not open');
			}
		}
		return $next($request);
	}
}
