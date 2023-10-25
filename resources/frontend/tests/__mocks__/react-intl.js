import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
const mockedModule = componentModuleMock(jest.createMockFromModule('react-intl'));

const intl = {
	messages: { '-1': 'Something went wrong connecting to server' },
};

mockedModule.injectIntl = (Node) => (props) => <Node {...props} intl={intl} />;

mockedModule.IntlProvider.getDerivedStateFromProps = null;

mockedModule.FormattedMessage = ({ children, ...props }) => {
	if (props.values) {
		props = { ...props, values: props.values.toString() };
	}
	let { newProps } = transformProps(props);
	return (
		<div {...newProps} data-testid="FormattedMessage">
			<div>{props.id}</div>
		</div>
	);
};

module.exports = mockedModule;
