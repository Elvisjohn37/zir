import { getStatementReport as getStatementReportAjax } from 'frontend/ajax/backend';

export function getStatementReport(
	isMounted,
	setDateRange,
	statementRange,
	setStatementData,
	setStatementDataLoading,
	setStatementDataError
) {
	setStatementDataLoading(true);

	getStatementReportAjax(
		statementRange,
		!isMounted,
		(response) => {
			setStatementDataLoading(false);
			setStatementData({
				content: response.data.data.content,
				footer: response.data.data.footer,
			});
			if (!isMounted) {
				setDateRange({
					isLoading: false,
					range: response.data.data.dateRange,
				});
			}
		},
		() => {
			setStatementDataError(true);
			setStatementDataLoading(false);
		}
	);
}
