<?php

namespace App\Http\Requests;

class PlayReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'gameID' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'gameID.*' => 'ERR_00002',
		];
	}
}
