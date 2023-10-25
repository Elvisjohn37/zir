export default function defaultRequestHeaders(axiosInstance) {
	let acceptHeader = 'Accept';
	let acceptValue = 'application/json';

	axiosInstance.defaults.headers.post[acceptHeader] = acceptValue;
	axiosInstance.defaults.headers.get[acceptHeader] = acceptValue;
}
