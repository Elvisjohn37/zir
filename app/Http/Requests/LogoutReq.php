<?php

namespace App\Http\Requests;

class LogoutReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return $this->bailAll([]);
	}
}
