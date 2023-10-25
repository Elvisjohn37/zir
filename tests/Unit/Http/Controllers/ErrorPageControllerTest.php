<?php

namespace Tests\Unit\Http\Controllers;

use Tests\TestCase;
use App\Http\Controllers\ErrorPageController;
use App\Exceptions\NotFoundException;

class ErrorPageControllerTest extends TestCase
{
	private function createController()
	{
		return new ErrorPageController();
	}

	public function testNotFoundShouldThrowNotFoundException()
	{
		$this->expectException(NotFoundException::class);

		$errorPageController = $this->createController();
		$errorPageController->notFound();
	}
}
