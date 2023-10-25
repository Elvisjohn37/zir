<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFoundException;

class ErrorPageController extends BaseController
{
	public function notFound()
	{
		throw new NotFoundException('404 Not found');
	}
}
