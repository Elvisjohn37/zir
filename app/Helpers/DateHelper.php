<?php
namespace App\Helpers;

class DateHelper
{
	public function diffMinutes($startDateTime, $endDateTime)
	{
		$difference = $startDateTime->diff($endDateTime);
		$minutes = $difference->days * 24 * 60;
		$minutes += $difference->h * 60;
		$minutes += $difference->i;

		return $minutes;
	}
}
