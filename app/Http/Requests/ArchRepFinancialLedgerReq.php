<?php

namespace App\Http\Requests;

class ArchRepFinancialLedgerReq extends BaseRequest
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
            'date' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'page.*' => 'ERR_00022',
            'date' => 'ERR_00022'
		];
	}
}
