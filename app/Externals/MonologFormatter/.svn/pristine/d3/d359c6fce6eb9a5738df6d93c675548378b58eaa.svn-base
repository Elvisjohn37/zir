<?php

namespace App\Externals\MonologFormatter;

use Monolog\Formatter\LineFormatter;
use Illuminate\Http\Request;
use Config;

/**
 * @version 1.0.0
 */
class BaseFormatter
{
	protected $request;

	public function __construct(Request $request = null)
	{
		$this->request = $request;
	}

	public function __invoke($logger)
	{
		foreach ($logger->getHandlers() as $handler) {
			$handler->setFormatter(new LineFormatter('%formattedlog%' . PHP_EOL))->pushProcessor([$this, 'formatter']);
		}
	}

	private function hasException($fomattedLogArray)
	{
		return isset($fomattedLogArray['context']) &&
			is_array($fomattedLogArray['context']) &&
			isset($fomattedLogArray['context']['exception']) &&
			is_object($fomattedLogArray['context']['exception']) &&
			method_exists($fomattedLogArray['context']['exception'], 'getMessage');
	}

	public function formatter(array $record): array
	{
		$fomattedLogArray = [
			'dateTime' => $record['datetime'],
			'appName' => $this->getAppName(),
			'version' => $this->getVersion(),
			'logLevel' => $record['level_name'],
			'ip' => $this->request->ip(),
			'uri' => $this->request->url(),
			'params' => $this->request->all(),
			'message' => $record['message'],
			'extra' => $record['extra'],
			'context' => $record['context'],
			'requestID' => request()->requestID,
		];

		if (is_object($this->request->user())) {
			$fomattedLogArray['user'] = [
				'username' => $this->request->user()->username,
			];
		}

		// get only line and file from exception context
		if ($this->hasException($fomattedLogArray)) {
			$exception = $fomattedLogArray['context']['exception'];
			$fomattedLogArray['context']['exception'] = [
				'file' => $exception->getFile(),
				'line' => $exception->getLine(),
			];

			if (method_exists($exception, 'getData')) {
				$fomattedLogArray['context']['exception']['data'] = $exception->getData();
			}
		}

		$fomattedLogArray = $this->addFormatter($fomattedLogArray);
		$record['formattedlog'] = json_encode($fomattedLogArray);

		return $record;
	}

	protected function getVersion()
	{
		return Config::get('custom.site.version');
	}

	protected function getAppName()
	{
		return Config::get('app.name');
	}

	protected function addFormatter($fomattedLogArray)
	{
		return $fomattedLogArray;
	}
}
