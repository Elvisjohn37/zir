<?php
return [
	'statement' => [
		'monthRange' => 3,
	],
	'transactionLog' => [
		'range' => '1 hour',
	],
	'rowPerPage' => (int) env('REPORT_ROW_PER_PAGE', 20),
];
