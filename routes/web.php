<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| All routes that needs access to session data.
|
*/

Route::group(['middleware' => ['validateopenstatus', 'validatesitemaintenance']], function () {
	Route::post('getgame', 'GameController@getGame');
	Route::get('play', 'GameController@play');
});

Route::post('getbalance', 'ClientController@getBalance');
Route::post('/getbalancebg', 'ClientController@getBalance')->withoutMiddleware([
	\App\Http\Middleware\LastActivity::class,
]);

Route::post('getarcfinledreport', 'ArchivedReportController@getArcFinLedReport');

Route::post('getStatementRange', 'TransactionController@getStatementRange');
Route::post('getstatementreport', 'TransactionController@getStatementReport');
Route::post('getrunningbets', 'TransactionController@getRunningBets');
Route::post('getplayerbetList', 'TransactionController@getPlayerBetList');
Route::post('getplayerpromolist', 'TransactionController@getPlayerPromoList');
Route::post('getplayertransferlist', 'TransactionController@getPlayerTransferList');
Route::post('getplayercreditlist', 'TransactionController@getPlayerCreditList');
Route::post('gettransactionlog', 'TransactionController@getTransactionLog');

Route::post('getgameledger', 'ArchivedReportController@getGameLedger');

Route::get('/betdetails', 'TransactionController@getBetDetails');
Route::post('/logout', 'ClientController@logout');
Route::post('settlerunninggame', 'TransactionController@settleRunningGame');

Route::post('getgamecategories', 'GameController@getGameCategories');

Route::withoutMiddleware([\App\Http\Middleware\ValidateLogin::class])->group(function () {
	Route::get('/account/transferfunds', 'SboWindowController@transferFundsWindow');
	Route::get('/account/balance', 'SboWindowController@balanceWindow');
	Route::get('/account/limitadjust', 'SboWindowController@limitAdjustWindow');
	Route::get('/account/selfexclusion', 'SboWindowController@selfExclusionWindow');
	Route::get('/sports', 'SboWindowController@sportsWindow');

	Route::post('/getgameguide', 'GameRuleController@getGameGuide');
	Route::post('/gethomeconfig', 'BannerController@getBanners');
	Route::post('getBsiGames', 'GameController@getBsiGames');
	Route::post('/getbanners', 'BannerController@getBanners');
	Route::post('getmainlayoutconfig', 'AppLayoutController@getMainLayoutConfig');

	Route::withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class])->group(function () {
		Route::group(['middleware' => 'validatesitemaintenance'], function () {
			Route::post('/login', 'ClientController@login');
			Route::get('/login', 'ClientController@login');
		});
	});

	Route::get('/getsession', 'ClientController@getSession');
	Route::post('getannouncement', 'AnnouncementController@getAnnouncement')->withoutMiddleware([
		\App\Http\Middleware\LastActivity::class,
	]);

	Route::view('/{path?}', 'index')
		->where('path', '^(?!api).*$')
		->middleware('mobilesitebsiredirect');
});
