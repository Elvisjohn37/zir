<?php

namespace App\Http\Requests;

class LogoutClientReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return $this->bailAll([
			'clientID' => 'required',
		]);
	}

	public function messages()
	{
		return [
			'clientID.*' => 'ERR_00023',
		];
	}
}
