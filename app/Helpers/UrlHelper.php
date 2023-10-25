<?php
namespace App\Helpers;

class UrlHelper
{
	/**
	 * remove subdomain
	 * @param  string $host
	 * @return string
	 */
	public function removeSubdomain($host)
	{
		$parsedUrl = parse_url($host);

		if (isset($parsedUrl['scheme'])) {
			$host = str_replace($parsedUrl['scheme'] . '://', '', $host);
		}

		$host_segments = explode('.', $host);
		$host_segments_length = sizeof($host_segments);

		if ($host_segments_length >= 3) {
			array_splice($host_segments, 0, 1);
		}

		return implode('.', $host_segments);
	}

	public function replaceDomain($toReplace, $newHost, $token = 'DOMAIN')
	{
		if (strpos($toReplace, '.' . $token . '.') !== false) {
			$host = $this->removeSubdomain($newHost);
			$toReplaceScheme = parse_url($toReplace);
			$hostScheme = parse_url($newHost);
			$scheme = isset($hostScheme['scheme']) ? $hostScheme['scheme'] : 'http';

			if (isset($toReplaceScheme['host'])) {
				$scheme = isset($toReplaceScheme['scheme']) ? $toReplaceScheme['scheme'] : $scheme;
				$toReplaceHost = $toReplaceScheme['host'];
			} else {
				$toReplaceHost = $toReplaceScheme['path'];
				$scheme = 'http';
			}

			$toReplace = strstr($toReplace, $toReplaceHost);
			$hostRemovedSubdomain = strstr($toReplaceHost, $token);
			return $scheme . '://' . str_replace($hostRemovedSubdomain, $host, $toReplace);
		} else {
			return $toReplace;
		}
	}
}
