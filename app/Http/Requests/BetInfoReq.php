<?php

namespace App\Http\Requests;

class BetInfoReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'payload' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'payload.*' => 'ERR_00002',
		];
	}
}
