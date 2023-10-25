<?php

namespace App\Http\Requests;

class GetGameGuideReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'lang' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'lang.*' => 'ERR_00022',
		];
	}
}
