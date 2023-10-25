<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use Tests\Mock\Http\Services\ResponseFormatterServiceMock;
use Tests\Mock\Http\Repositories\GameRepositoryMock;
use Tests\Mock\Http\Repositories\AppRepositoryMock;
use App\Http\Controllers\GameRuleController;
use Tests\Mock\Laravel\ConfigMock;
use App\Http\Requests\GetGameGuideReq;

class GameRuleControllerTest extends TestCase
{
	use ResponseFormatterServiceMock, GameRepositoryMock, AppRepositoryMock, ConfigMock;

	private function createController($responseFormatterService = null, $gameRepository = null, $appRepository = null)
	{
		$responseFormatterService =
			$responseFormatterService !== null ? $responseFormatterService : $this->mockresponseFormatterService();

		$gameRepository = $gameRepository !== null ? $gameRepository : $this->mockGameRepository();

		$appRepository = $appRepository !== null ? $appRepository : $this->mockAppRepository();

		return new GameRuleController($responseFormatterService, $gameRepository, $appRepository);
	}

	public function testGetGameGuideSouldGetGameGuideData()
	{
		$this->stubConfig(['custom.gamerules.sboLiveDealerPath' => '/samplepath']);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameRepository = $this->stubGameRepositoryGetGameGuideList();
		$appRepository = $this->stubAppRepositoryGetSboInfoCenterUrl();
		$lang = 'en';

		$gameRuleController = $this->createController($responseFormatterService, $gameRepository, $appRepository);
		$getGameGuide = $gameRuleController->getGameGuide(new GetGameGuideReq(['lang' => $lang]));

		$this->assertEquals(
			[
				'config' => [
					'liveDealerGameLink' => 'www.sbo-center-sample.com' . '/samplepath',
				],
				'gameGuideList' => $lang,
			],
			$getGameGuide
		);
	}

	public function testGetGameGuideSouldGetCorrectGameGuideDataWhenLanguageChanges()
	{
		$this->stubConfig(['custom.gamerules.sboLiveDealerPath' => '/samplepath']);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameRepository = $this->stubGameRepositoryGetGameGuideList();
		$appRepository = $this->stubAppRepositoryGetSboInfoCenterUrl();
		$lang = 'th';

		$gameRuleController = $this->createController($responseFormatterService, $gameRepository, $appRepository);
		$getGameGuide = $gameRuleController->getGameGuide(new GetGameGuideReq(['lang' => $lang]));

		$this->assertEquals(
			[
				'config' => [
					'liveDealerGameLink' => 'www.sbo-center-sample.com' . '/samplepath',
				],
				'gameGuideList' => $lang,
			],
			$getGameGuide
		);
	}

	public function testGetGameGuideSouldGetCorrectGameGuideDataWhenConfigChanges()
	{
		$this->stubConfig(['custom.gamerules.sboLiveDealerPath' => '/samplepath2']);
		$responseFormatterService = $this->stubResponseFormatterServiceSuccess();
		$gameRepository = $this->stubGameRepositoryGetGameGuideList();
		$appRepository = $this->stubAppRepositoryGetSboInfoCenterUrl();
		$lang = 'en';

		$gameRuleController = $this->createController($responseFormatterService, $gameRepository, $appRepository);
		$getGameGuide = $gameRuleController->getGameGuide(new GetGameGuideReq(['lang' => $lang]));

		$this->assertEquals(
			[
				'config' => [
					'liveDealerGameLink' => 'www.sbo-center-sample.com' . '/samplepath2',
				],
				'gameGuideList' => $lang,
			],
			$getGameGuide
		);
	}
}
