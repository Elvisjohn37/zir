import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../DatePicker'));

mockedModules.DesktopDatePicker = ({ ...props }) => {
	return (
		<div data-testid="DesktopDatePicker">
			<div>{`selectedDate prev: ${props.selectedDate.getHours()}`}</div>
			<div>{`selectedDate next: ${props.selectedDate.getHours()}`}</div>
			<div>{`maxDate: ${props.dateMinMax.maxDate}`}</div>
			<div>{`minDate: ${props.dateMinMax.minDate}`}</div>
		</div>
	);
};

mockedModules.MobileDatePicker = ({ refresh, ...props }) => {
	Date.prototype.addHours = function (h) {
		this.setTime(this.getTime() + h * 60 * 60 * 1000);
		return this;
	};

	return (
		<div
			data-testid="MobileDatePicker"
			onClick={() => {
				props.setSelectedDate(props.selectedDate.addHours(1));
				refresh();
			}}
		>
			<div>{`selectedDate: ${props.selectedDate}`}</div>
			<div>{`minDate: ${props.dateMinMax ? props.dateMinMax.minDate : null}`}</div>
		</div>
	);
};

module.exports = mockedModules;
