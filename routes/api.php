<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes that are being used by other projects.
|
|
*/

Route::get('/betinfo/{type}', 'TransactionController@betInfo')->where('type', 'eyecon|funky');

Route::post('logoutall', 'ClientController@logoutAll');

Route::post('isclientlogin', 'ClientController@isClientLogin');

Route::post('logoutclient', 'ClientController@logoutClientID');

Route::post('sbologoutclient', 'ClientController@sboLogoutClientID');

Route::post('deletegamesession', 'GameController@deleteGameSession');

Route::post('updateactivity', 'ClientController@updateClientActivity');