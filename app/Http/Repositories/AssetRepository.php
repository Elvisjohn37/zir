<?php

namespace App\Http\Repositories;

use Config;

class AssetRepository extends BaseRepository
{
	private $manifestPath;

	function __construct()
	{
		$this->manifestPath = '../' . Config::get('custom.asset.manifest');
	}

	public function getManifestContent(string $type, string $entryPoint): array
	{
		$data = file_get_contents($this->manifestPath);

		if ($data === false) {
			return ['result' => false, $data, 'message' => 'File Not Found'];
		} else {
			$decodeManifest = json_decode($data, true);
			$decodeManifest = empty($decodeManifest) ? [] : $decodeManifest;

			if (!isset($decodeManifest[$entryPoint])) {
				return ['result' => false, 'data' => $decodeManifest, 'message' => 'Entry Point Not Found'];
			}

			if (!isset($decodeManifest[$entryPoint][$type])) {
				return ['result' => false, 'data' => $decodeManifest, 'message' => 'Type Not Found'];
			}

			return ['result' => true, 'data' => $decodeManifest[$entryPoint][$type], 'message' => 'Success'];
		}
	}
}
