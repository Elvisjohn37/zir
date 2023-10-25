let errorData;
let getError = () => {
	return errorData;
};
let setError = (data) => {
	errorData.data = { ...errorData.data, ...data };
};
let resetError = () => {
	errorData = {
		data: { result: false, error: { code: '-1', message: 'Something went wrong connecting to server' } },
	};
};
resetError();

module.exports = {
	setError,
	resetError,
	getError,
};
