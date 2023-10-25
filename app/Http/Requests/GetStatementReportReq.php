<?php

namespace App\Http\Requests;

class GetStatementReportReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'rangeNo' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'rangeNo.*' => 'ERR_00022',
		];
	}
}
