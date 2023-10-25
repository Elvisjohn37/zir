import React from 'react';
import { transformProps } from 'frontend/tests/helpers';
let mockedModules = jest.createMockFromModule('@mui/x-date-pickers/DateTimePicker');

mockedModules.DateTimePicker = ({ children, onClose, onChange, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} onClick={onClose}>
			<input
				data-testid="DateTimePicker"
				onChange={() => {
					onChange({
						dateTime: '9/20/2021 4:00:00 PM',
						getDate: () => null,
						getFullYear: () => null,
						getHours: () => null,
						getMinutes: () => null,
						getMonth: () => null,
						setHours: () => null,
						setMinutes: () => null,
						type: () => null,
					});
				}}
			/>
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
