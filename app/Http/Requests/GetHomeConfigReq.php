<?php

namespace App\Http\Requests;

class GetHomeConfigReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'type' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'type.*' => 'ERR_00002',
		];
	}
}
