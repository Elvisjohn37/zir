<?php

namespace App\Http\Requests;

class GetBetDetailsReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'betID' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'betID.*' => 'ERR_00002',
		];
	}
}
