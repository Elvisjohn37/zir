<?php

namespace App\Http\Requests;

class GetGameReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'page' => 'required',
			'isMobileDevice' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'page.*' => 'ERR_00002',
			'isMobileDevice.*' => 'ERR_00002',
		];
	}
}
