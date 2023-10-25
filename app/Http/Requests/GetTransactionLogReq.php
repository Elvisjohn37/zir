<?php

namespace App\Http\Requests;

class GetTransactionLogReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'page' => 'required|integer',
			'date' => 'required|date',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'page' => 'ERR_00033',
			'date' => 'ERR_00012',
		];
	}
}
