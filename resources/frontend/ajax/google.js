import axios from 'axios';

let axiosInstance = axios.create();

export function googleDocs(url, success, error) {
	axiosInstance
		.get(`${url}&timestamp=${new Date().getTime()}`)
		.then(success)
		.catch(error ? error : () => {});
}
