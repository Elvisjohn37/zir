import React from 'react';

export function setDate(date) {
	let dateMock;
	if (typeof date == 'object' && date.type === 'datemock') {
		dateMock = date;
	} else {
		dateMock = {
			type: 'datemock',
			setMinutes: jest.fn(),
			getHours: () => date,
			getMonth: () => date,
			getDate: () => date,
			getFullYear: () => date,
			getMinutes: () => date,
			setHours: jest.fn(),
			dateTime: date,
		};
	}
	jest.spyOn(global, 'Date').mockImplementation(() => dateMock);

	return dateMock;
}

export function componentModuleMock(mockedModule, defaultFnName, options) {
	options = options || { options: { elementToUse: {}, additionalProps: {} } };
	options.elementToUse = options.elementToUse || {};
	options.additionalProps = options.additionalProps || {};

	Object.keys(mockedModule).forEach(function (fnName) {
		if (isComponent(mockedModule[fnName], fnName)) {
			let isRenameDefault = defaultFnName !== undefined && defaultFnName !== null && fnName == 'default';
			mockedModule[fnName] = componentMock(
				isRenameDefault ? defaultFnName : fnName,
				options.elementToUse[fnName],
				options.additionalProps[fnName]
			);
		}
	});

	return mockedModule;
}

export default function componentMock(fnName, elementToUse, additionalProps) {
	additionalProps = additionalProps || {};
	let mockValue = React.forwardRef(({ children, ...props }, ref) => {
		let { newProps, childProps } = transformProps(props);
		newProps = { ...newProps, ...additionalProps };
		newProps['data-testid'] = fnName;
		newProps['ref'] = ref;

		return renderMock(elementToUse || 'div', newProps, children, childProps);
	});

	Object.defineProperty(mockValue, 'name', { value: fnName, writable: false });

	return mockValue;
}

export function renderMock(Component, props, children, childProps) {
	let newChildren;

	if (childProps.length > 0) {
		newChildren = (
			<>
				{children}
				{childProps.map((prop, index) => {
					return (
						<React.Fragment key={index}>
							<div>{JSON.stringify(prop.props)}</div>
						</React.Fragment>
					);
				})}
			</>
		);
	} else {
		newChildren = children;
	}

	if (typeof Component === 'string' || Component instanceof String) {
		return React.createElement(Component, props, newChildren);
	} else {
		return <Component {...props}>{newChildren}</Component>;
	}
}

export function transformProps(props) {
	let newProps = {};
	let childProps = [];

	if (typeof props === 'object') {
		Object.keys(props).forEach(function (propName) {
			let prop = props[propName];

			if (React.isValidElement(prop)) {
				childProps.push(prop);
			} else if (isComponent(prop)) {
				let ChildProp = prop;
				childProps.push(<ChildProp />);
			} else {
				let isStringify = (Array.isArray(prop) || typeof prop === 'object') && propName != 'className';
				let booleanAttr = ['open', 'disabled'];
				let isToString = typeof prop == 'boolean' && booleanAttr.indexOf(propName) === -1;
				let finalPropName =
					typeof prop == 'function' || propName == 'className' ? propName : propName.toLowerCase();

				newProps[finalPropName] = isStringify ? JSON.stringify(prop) : isToString ? prop.toString() : prop;
			}
		});
	}

	return { newProps, childProps };
}

function mapObject(obj) {
	return Object.keys(obj).map((item) => {
		return;
	});
}

function firstIsUppercase(str) {
	if (typeof str !== 'string' || str.length === 0) {
		return false;
	}

	if (str[0].toUpperCase() === str[0]) {
		return true;
	}

	return false;
}

function isComponent(component, componentName) {
	let isNamedComponent =
		typeof component === 'function' &&
		componentName !== undefined &&
		componentName !== null &&
		(firstIsUppercase(componentName) || componentName == 'default');

	if (isNamedComponent) {
		return true;
	} else {
		let isHocComponent =
			typeof component === 'object' && component.hasOwnProperty('$$typeof') && !React.isValidElement();

		if (isHocComponent) {
			return true;
		} else {
			let isClassComponent = typeof component === 'function' && !!component.prototype.isReactComponent;

			if (isClassComponent) {
				return true;
			} else {
				let isFnComponent =
					typeof component === 'function' &&
					String(component).includes('react.') &&
					String(component).includes('.createElement');

				if (isFnComponent) {
					return true;
				} else {
					return false;
				}
			}
		}
	}
}
