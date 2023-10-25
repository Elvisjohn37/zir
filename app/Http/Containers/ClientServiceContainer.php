<?php

namespace App\Http\Containers;

use App\Http\Services\ResponseFormatterService;
use App\Http\Services\ClientStatusValidatorService;
use App\Http\Services\ClientConvertService;

class ClientServiceContainer
{
	public $responseFormatter;
	public $clientStatusValidatorService;
	public $clientConvertService;

	public function __construct(
		ResponseFormatterService $responseFormatter,
		ClientStatusValidatorService $clientStatusValidatorService,
		ClientConvertService $clientConvertService
	) {
		$this->responseFormatter = $responseFormatter;
		$this->clientStatusValidatorService = $clientStatusValidatorService;
		$this->clientConvertService = $clientConvertService;
	}
}
