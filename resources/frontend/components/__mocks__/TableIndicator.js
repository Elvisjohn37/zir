import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../TableIndicator'));

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);
	let onClick = props.pagination
		? { onClick: () => props.pagination.onPageChange(null, props.pagination.page + 1) }
		: {};

	return (
		<div {...newProps} data-testid="TableIndicator" {...onClick}>
			{props.pagination ? (
				<>
					<span>{'Pagination count: ' + props.pagination.count}</span>
					<span>{'Pagination page: ' + props.pagination.page}</span>
					<span>{'Pagination rowsPerPage: ' + props.pagination.rowsPerPage}</span>
				</>
			) : (
				<></>
			)}
			{props.isLoading ? <span>Loading TableIndicator</span> : <span>Done loading TableIndicator</span>}
			{props.isError ? <span>Error Response</span> : ''}
			{props.isEmpty && <span>TableIndicator Empty</span>}
			{children}
			{childProps.map((item) => console.log(item))}
		</div>
	);
};

module.exports = mockedModules;
