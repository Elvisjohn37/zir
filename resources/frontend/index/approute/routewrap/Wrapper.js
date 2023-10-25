import React from 'react';

function Wrapper({ wrappers, children }) {
	let wrappersCopy = [...wrappers];
	let { component: CurrentWrapperComponent, ...currentWrapperProps } = wrappersCopy.shift();

	return (
		<CurrentWrapperComponent {...currentWrapperProps}>
			{wrappersCopy.length > 0 ? <Wrapper wrappers={wrappersCopy}>{children}</Wrapper> : children}
		</CurrentWrapperComponent>
	);
}

export { Wrapper };
