function lazy(importFn) {
	let fnExpression = importFn.toString();
	let getModulePath = fnExpression.match(/require\('(.*?)'\)/);
	let componentName = getModulePath !== null ? getModulePath[1].split('/').pop() : 'Component';
	let mockComponent = ({ children }) => {
		if (children !== undefined) {
			return children;
		} else {
			return null;
		}
	};

	Object.defineProperty(mockComponent, 'name', { value: componentName, writable: false });

	return mockComponent;
}

let contextConsumer = jest.fn();
function createContext() {
	return {
		Provider: ({ children }) => {
			return children;
		},
		Consumer: contextConsumer,
	};
}

let reducerState;
let reducerDispatch;
function useReducer(reducer, state) {
	reducerState = state;
	reducerDispatch = reducer;
	return [reducerState, reducerDispatch];
}
function getUseReducer() {
	return { reducerState, reducerDispatch };
}

let useRefValue;

let useRef = () => useRefValue;

let setUseRef = (value) => (useRefValue = value);

module.exports = { lazy, createContext, useReducer, getUseReducer, setUseRef, useRef };
