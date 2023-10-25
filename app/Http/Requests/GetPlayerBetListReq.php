<?php

namespace App\Http\Requests;

use App\Http\Services\ReportService;
use Validator;

class GetPlayerBetListReq extends BaseRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		$datas = [
			'date' => 'required',
			'page' => 'required',
			'productID' => 'required',
		];

		return $this->bailAll($datas);
	}

	public function messages()
	{
		return [
			'date.*' => 'ERR_00022',
			'page.*' => 'ERR_00022',
			'productID.*' => 'ERR_00022',
		];
	}

	public function withValidator($validator)
	{
		$validator->after(function ($validator) {
			if (count($validator->failed()) <= 0) {
				$reportService = new ReportService();
				$dateRange = $reportService->getDateRange();
				$startDateRange = customDateFormat('Y-m-d', $dateRange[0]['startDate']);
				$endDateRange = customDateFormat('Y-m-d', $dateRange[2]['endDate']);

				$afterValidator = Validator::make(
					$validator->getData(),
					$this->bailAll([
						'date' =>
							'required|date|after_or_equal:' . $startDateRange . '|before_or_equal:' . $endDateRange,
					]),
					[
						'date' => 'ERR_00022',
					]
				);

				foreach ($afterValidator->errors()->getMessages() as $field => $value) {
					$validator->errors()->add($field, $value[0]);
				}
			}
		});
	}
}
