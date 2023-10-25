export function autoAddCsrfToken(axiosInstance) {
	let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute('content');
	let headerName = 'X-CSRF-TOKEN';

	axiosInstance.defaults.headers.post[headerName] = csrfToken;
	axiosInstance.defaults.headers.put[headerName] = csrfToken;
	axiosInstance.defaults.headers.delete[headerName] = csrfToken;
	axiosInstance.defaults.headers.patch[headerName] = csrfToken;
	axiosInstance.defaults.headers.trace = {};
	axiosInstance.defaults.headers.trace[headerName] = csrfToken;
}
