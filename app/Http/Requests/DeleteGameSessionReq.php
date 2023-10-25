<?php

namespace App\Http\Requests;

class DeleteGameSessionReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'clientID' => 'required',
			'gameID' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'clientID.*' => 'ERR_00002',
			'gameID.*' => 'ERR_00002',
		];
	}
}
