<?php
return [
	'key' => env('LANG_KEY'),
	'available' => env('LANG_AVAILABLE', 'en,zh,ko,id'),
	'disabled' => env('LANG_DISABLED', 'zh,ko,id'),
	'default' => env('LANG_DEFAULT', 'en'),
	'sboMobileKey' => env('LANG_SBO_MOBILE_KEY', 'lang'),
];
