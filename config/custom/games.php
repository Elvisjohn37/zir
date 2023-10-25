<?php
return [
	'topLimit' => env('GAME_TOP_LIMIT'),
	'recentLimit' => env('GAME_RECENT_LIMIT'),
	'productIDs' => ['games' => env('GAME_PRODUCTID_GAMES'), 'home' => env('GAME_PRODUCTID_GAMES')],
	'gameTypeOrder' => ['games' => env('GAME_TYPE_ORDER'), 'home' => env('GAME_TYPE_ORDER')],
];
