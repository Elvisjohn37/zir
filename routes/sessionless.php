<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Session Less Routes
|--------------------------------------------------------------------------
|
| All routes that does not need session data and being used only by this
| project.
|
*/

Route::get('healthcheck', 'AppController@healthCheck');

Route::get('ismaintenance', 'AppController@isMaintenance');

Route::get('ready', 'AppController@ready');

Route::post('getnolayoutconfig', 'AppLayoutController@getNoLayoutConfig');

/**
 * This route is used for iframes that can be injected with content
 * */
Route::get('/frame', function () {
	return '';
});

Route::get('/error/notfound', 'ErrorPageController@notfound');

Route::post('/lastactivity', 'ClientController@inActivePlayers');

Route::get('closegame', 'GameController@closeGame');
