<?php
return [
	'sboMobileAssetExpiration' => env('SBO_MOBILE_CACHE_EXP', 10),
	'sboMobileManifestPath' => env('SBO_MOBILE_MANIFEST_PATH', '/resources.json'),
	'sboMobileUrl' => env('SBO_MOBILE_URL'),
	'isHttps' => env('APP_IS_HTTPS_MOBILE'),
	'isMobile' => env('APP_IS_MOBILE'),
	'sboMobileVerifySsl' => env('SBO_MOBILE_VERIFY_SSL'),
];
