import React from 'react';
import { componentModuleMock, transformProps } from 'frontend/tests/helpers';
let mockedModules = componentModuleMock(jest.createMockFromModule('../Language'));

mockedModules.default = ({ children, ...props }) => {
	let { newProps, childProps } = transformProps(props);

	return (
		<div {...newProps} data-testid="Language">
			{children}
			{childProps.map(() => childProps)}
		</div>
	);
};

let langState;
mockedModules.langDispatch = jest.fn();

// main component
mockedModules.LangConsumer = ({ children }) => {
	return children({ langState, langDispatch: mockedModules.langDispatch });
};

// setter
mockedModules.setLangState = (state) => {
	Object.assign(langState, state);
};

// module resetter
mockedModules.resetLangState = () => {
	langState = { active: 'en', available: ['en', 'zh', 'ko', 'th'], disabled: ['th'] };
};
mockedModules.resetLangState();

// getter
mockedModules.getLangState = () => {
	return langState;
};

module.exports = mockedModules;
