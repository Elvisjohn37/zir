<?php
return [
	'routeOnSuccess' => env('LOGIN_SUCCESS_ROUTE', '/'),
	'inActive' => env('LOGIN_IDLE_TIMEOUT', 30),
	'createdFromID' => env('PS_APPLICATION_ID', 1),
];
