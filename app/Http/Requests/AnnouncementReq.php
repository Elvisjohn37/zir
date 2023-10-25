<?php

namespace App\Http\Requests;

class AnnouncementReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'viewType' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'viewType.*' => 'ERR_00002',
		];
	}
}
