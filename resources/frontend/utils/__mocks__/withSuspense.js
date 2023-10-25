import React from 'react';

let isLoading = true;

let withSuspense = function(Component, Fallback) {
    return () => isLoading ? Fallback : <Component />
};

let setIsLoading = (value) => {
	isLoading = value;
};
let resetIsLoading = () => {
	isLoading = true;
};

resetIsLoading();

export { setIsLoading, resetIsLoading };

export default withSuspense;
