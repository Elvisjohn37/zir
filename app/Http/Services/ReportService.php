<?php

namespace App\Http\Services;

use App\Externals\Aes\Custom\ZirconAes;
use Config;
use Vinkla\Hashids\Facades\Hashids;

class ReportService
{
	public function getDateRange()
	{
		$statement_months = Config::get('custom.reports.statement.monthRange');
		$statement_dates = [];
		for ($i = $statement_months; $i >= 1; $i--) {
			$date = previous_date(date('Y-m-01'), $i - 1, 'months');
			$month_last_day = month_last_day($date);

			$startDate = customDateFormat('Y-m-d', $date);
			$endDate = customDateFormat('Y-m-' . $month_last_day, $date);

			array_push($statement_dates, [
				'number' => $i,
				'startDate' => $startDate,
				'endDate' => $endDate,
			]);
		}

		return $statement_dates;
	}

	/**
	 * This will get the offset and limit to be used
	 * depending on given page and config
	 * @param  int    $page
	 * @param  string $paging_for
	 * @return array
	 */
	public function pagingOffsetLimit($page)
	{
		$limit = Config::get('custom.reports.rowPerPage');

		if (!is_numeric($page) || $page <= 0) {
			$page = 1;
		}
		$offset = ($page - 1) * $limit;

		return compact('limit', 'offset');
	}

	public function addTableNameFormat(&$formattedArray, $transactionDetail)
	{
		switch ($transactionDetail->event) {
			case 'P':
				$formattedArray['tableNameFormat'] = 'promotion';
				break;
			case 'A':
				if (!$transactionDetail->result) {
					$formattedArray['tableNameFormat'] = 'productName';
					$this->addToFormattedArray($formattedArray, $transactionDetail, 'productName');
					break;
				}

				$formattedArray['tableNameFormat'] = 'resultTableName';
				break;

			default:
				switch ($transactionDetail->productID) {
					case 6:
					case 3:
						$formattedArray['tableNameFormat'] = 'resultTableName';

						break;

					case 7:
					case 2:
						$formattedArray['tableNameFormat'] = 'gameTableName';
						$this->addToFormattedArray($formattedArray, $transactionDetail, 'gameName');
						break;
					default:
						$formattedArray['tableNameFormat'] = 'gameName';
						$this->addToFormattedArray($formattedArray, $transactionDetail, 'gameName');
						break;
				}
		}
	}

	public function addRoundIDFormat(&$formattedArray, $transactionDetail)
	{
		switch ($transactionDetail->event) {
			case 'P':
				$formattedArray['roundIDFormat'] = 'noRoundID';
				break;
			case 'A':
				$formattedArray['roundIDFormat'] = 'netwinAdjustment';
				break;
			default:
				$transactionDetail->gameID = sprintf('%05d', $transactionDetail->gameID);
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'gameID');

				switch ($transactionDetail->productID) {
					case 4:
						$formattedArray['roundIDFormat'] = 'roundID';
						$this->addToFormattedArray($formattedArray, $transactionDetail, 'roundID');
						break;
					default:
						$formattedArray['roundIDFormat'] = 'roundDetID';
						$this->addToFormattedArray($formattedArray, $transactionDetail, 'roundDetID');
						break;
				}
		}
	}

	public function addBetLink(&$formattedArray, $transactionDetail)
	{
		switch ($transactionDetail->event) {
			case 'A':
			case 'V':
			case 'X':
			case 'B':
			case 'P':
				$formattedArray['betLinkFormat'] = 'noBetLink';
				break;
			case 'R':
				if (!in_array($transactionDetail->gameID, [3])) {
					$formattedArray['betLinkFormat'] = 'noBetLink';
					break;
				}
			default:
				switch ($transactionDetail->productID) {
					case 5:
						$formattedArray['betLinkFormat'] = 'noBetLink';
						break;
					default:
						$formattedArray['betLinkFormat'] = 'hasBetLink';
						$this->addToFormattedArray($formattedArray, $transactionDetail, 'transactionDetID');
				}
		}
	}

	public function addReasonMessage(&$formattedArray, $transactionDetail)
	{
		switch ($transactionDetail->event) {
			case 'A':
			case 'P':
				$formattedArray['reasonFormat'] = 'messageReason';
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'message');
				break;
			default:
				$formattedArray['reasonFormat'] = 'noReason';
		}
	}

	public function addGameDetailsFields(&$formattedArray, $transactionDetail, $addEndDateTime = false)
	{
		$this->addBetLink($formattedArray, $transactionDetail);
		$this->addReasonMessage($formattedArray, $transactionDetail);
		$this->addRoundIDFormat($formattedArray, $transactionDetail);
		$this->addTableNameFormat($formattedArray, $transactionDetail);
		$this->addGameDetailsEndDateTime($formattedArray, $transactionDetail, $addEndDateTime);
	}

	private function addGameDetailsEndDateTime(&$formattedArray, $transactionDetail, $addEndDateTime)
	{
		if ($transactionDetail->event !== 'P' && $addEndDateTime) {
			$this->addToFormattedArray($formattedArray, $transactionDetail, 'timestampEnd');
			$formattedArray['addGameDetailsEndDateTime'] = true;
		} else {
			$formattedArray['addGameDetailsEndDateTime'] = false;
		}
	}

	public function addGameResultFields(&$formattedArray, $transactionDetail)
	{
		$this->addToFormattedArray($formattedArray, $transactionDetail, 'event');
	}

	public function addStakeTurnoverFields(&$formattedArray, $transactionDetail)
	{
		$this->addToFormattedArray($formattedArray, $transactionDetail, 'stake');
		$this->addToFormattedArray($formattedArray, $transactionDetail, 'turnover');
	}
	public function addMembersWLCommision(&$formattedArray, $transactionDetail)
	{
		switch ($transactionDetail->transactionType) {
			case 'Betting':
			case 'Promotion':
				$formattedArray['memWLCommisionFormatter'] = 'withMemWLCommission';

				$this->addToFormattedArray($formattedArray, $transactionDetail, 'netwin');
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'commission');
				break;
			default:
				$formattedArray['memWLCommisionFormatter'] = 'noMemWLCommission';
		}
	}

	public function addToFormattedArray(&$formattedArray, $transactionDetail, $field)
	{
		if (!isset($formattedArray[$field])) {
			switch ($field) {
				case 'transactionDetID':
					$formattedArray[$field] = $this->localEncrypt($transactionDetail->$field);
					break;

				default:
					$formattedArray[$field] = $transactionDetail->$field;
			}
		}
	}

	public function addTransferDescriptionFields(&$formattedArray, $transactionDetail)
	{
		switch (strtolower($transactionDetail->transferTypeName)) {
			case 'deposit':
				$formattedArray['descriptionFormat'] = 'depositApproved';
				break;
			case 'withdrawal':
				$formattedArray['descriptionFormat'] = 'withdrawalApproved';
				break;
			case 'adjustment':
				$formattedArray['descriptionFormat'] = 'transferAdjustment';
				break;
			case 'cutoff':
				$formattedArray['descriptionFormat'] = 'transferCutoff';
				break;
			case 'fund':
				$formattedArray['descriptionFormat'] = 'transferFund';
				break;
		}
	}

	public function addTransferAmountFields(&$formattedArray, $transactionDetail)
	{
		switch (strtolower($transactionDetail->transferTypeName)) {
			case 'withdrawal':
				$formattedArray['amountFormat'] = 'withdrawalAmount';
				break;
			default:
				$formattedArray['amountFormat'] = 'defaultAmount';
		}
		$this->addToFormattedArray($formattedArray, $transactionDetail, 'amount');
	}
	public function addOutstandingBalanceFields(&$formattedArray, $transactionDetail)
	{
		$formattedArray['outstandingBalanceFormat'] = 'noOutstandingBalance';
	}

	public function dateTimeRange($dateTime)
	{
		$startDate = customDateFormat('Y-m-d H:i:s', $dateTime);
		return [
			'startDate' => $startDate,
			'endDate' => calculateDateTime(
				$startDate,
				'-1 minute +59 second +' . Config::get('custom.reports.transactionLog.range')
			),
		];
	}

	public function addCashBalanceGame(&$formattedArray, $transactionDetail)
	{
		$this->addToFormattedArray($formattedArray, $transactionDetail, 'cashBalance');
		$this->addToFormattedArray($formattedArray, $transactionDetail, 'availableCredit');
		$this->addToFormattedArray($formattedArray, $transactionDetail, 'playableBalance');
	}

	public function addTypeProduct(&$formattedArray, $transactionDetail)
	{
		switch (strtolower($transactionDetail->transactionType)) {
			case 'betting':
				$formattedArray['typeProductFormat'] = 'typeProductName';
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'productName');
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'transactionType');
				break;
			default:
				$formattedArray['typeProductFormat'] = 'defaultTypeProduct';
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'transactionType');
				break;
		}
	}

	public function addAmount(&$formattedArray, $transactionDetail)
	{
		switch (strtolower($transactionDetail->transactionType)) {
			case 'betting':
				$formattedArray['amountFormat'] = 'noAmount';

				break;
			default:
				$formattedArray['amountFormat'] = 'defaultAmount';
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'amount');
				break;
		}
	}

	public function getPayload($betDetails, $languageID)
	{
		$zirconAes = new ZirconAes();

		switch ($betDetails->gameProviderID) {
			// Funky
			case 3:
				return [
					'payload' => $zirconAes->encrypt(
						http_build_query([
							'bet_id' => $betDetails->transactionDetID,
							'lang' => $languageID,
						])
					),
				];
			default:
				return [
					'payload' => $zirconAes->encrypt(
						http_build_query([
							'bet_id' => $betDetails->roundDetID,
							'lang' => $languageID,
						])
					),
				];
		}
	}

	public function getDate($dateRangeNo)
	{
		return [
			'startDate' => date('Y-m-01', strtotime(date('Y-m') . ' -' . ($dateRangeNo - 1) . ' month')),
			'endDate' => date('Y-m-t', strtotime(date('Y-m') . ' -' . ($dateRangeNo - 1) . ' month')),
		];
	}

	public function addProductName(&$formattedArray, $transactionDetail)
	{
		switch ($transactionDetail->transactionType) {
			case 'Promotion':
				$formattedArray['productFormat'] = 'promotion';
			default:
				$formattedArray['productFormat'] = 'defaultProductName';
				$formattedArray['productID'] = $this->localEncrypt($transactionDetail->productID);
				$this->addToFormattedArray($formattedArray, $transactionDetail, 'productName');
		}
	}

	public function localEncrypt($toEncrypt)
	{
		return Hashids::encode($toEncrypt);
	}

	public function localDecrypt($toDecrypt)
	{
		return Hashids::decode($toDecrypt);
	}

	public function addStatementFooter(&$footer, $transactionDetail)
	{
		foreach ($footer as $field => $value) {
			if (is_numeric($transactionDetail->$field)) {
				$footer[$field] += $transactionDetail->$field;
			}
		}
	}
}
