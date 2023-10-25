import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/lab/DateTimePicker');

mockedModules.default = ({ children, onClose, onChange, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="DateTimePicker" onClick={onClose}>
			<div>{JSON.stringify(props.value)}</div>
			<div>maxDate: {JSON.stringify(new Date(props.maxDate))}</div>
			<div>minDate: {JSON.stringify(new Date(props.minDate))}</div>
			{children}
			{childProps.map((item, index) => (
				<div key={index}></div>
			))}
		</div>
	);
};

module.exports = mockedModules;
