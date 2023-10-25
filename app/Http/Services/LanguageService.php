<?php

namespace App\Http\Services;

use Config;
use Cookie;

class LanguageService
{
	private $sboToPs = [
		'en' => 'en',
		'zh-cn' => 'zh',
		'zh-tw' => 'zh',
		'ko-kr' => 'ko',
		'th-th' => 'th',
	];

	public function getCurrent()
	{
		return isset($_COOKIE[Config::get('custom.language.key')])
			? $_COOKIE[Config::get('custom.language.key')]
			: Config::get('app.fallback_locale');
	}

	public function isUsable($lang)
	{
		$available = explode(',', Config::get('custom.language.available'));
		$disabled = explode(',', Config::get('custom.language.disabled'));

		$usable = array_diff($available, $disabled);
		return in_array($lang, $usable);
	}

	public function getFromSbo($sboLang)
	{
		$lang = isset($this->sboToPs[$sboLang]) ? $this->sboToPs[$sboLang] : null;

		if (!$this->isUsable($lang)) {
			$lang = Config::get('app.fallback_locale');
		}

		return $lang;
	}

	public function setFromSbo($sboLang)
	{
		$lang = $this->getFromSbo($sboLang);

		Cookie::queue(Config::get('custom.language.key'), $lang, 0, null, null, false, false);

		return $lang;
	}

	public function gameLangFormat($productID)
	{
		$language_id = $this->getCurrent();

		// determine game langID format via productID (last attempt)
		switch ($productID) {
			case 5:
			case 6:
			case 8:
				if ($language_id != 'en') {
					return $language_id .= '-' . $language_id;
				}

				break;
		}

		return $language_id;
	}

	public function getLayoutConfig($isMobileSite)
	{
		$languageConfig = Config::get('custom.language');

		if ($isMobileSite) {
			$sboLang = Cookie::get(Config::get('custom.language.sboMobileKey'));
			$languageConfig['force'] = $this->getFromSbo($sboLang);
		}

		return $languageConfig;
	}
}
