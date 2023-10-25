import { randomNumber, isObject } from 'frontend/utils/helper';

let subscriptions = {
	success: [],
	error: [],
};

export function subscribe(event, eventFunction) {
	let id = randomNumber(3);
	subscriptions[event].push({ function: eventFunction, id: id });
	return id;
}

export function unsubscribe(event, evetnID) {
	subscriptions[event] = subscriptions[event].filter((error) => error.id != evetnID);
}

export function responseInterceptor(axiosInstance) {
	axiosInstance.interceptors.response.use(
		function (response) {
			if (isObject(response.data) && response.data.result) {
				subscriptions.success.forEach((success) => success.function(response));
				return response;
			} else {
				subscriptions.error.forEach((error) => error.function(response));
				// eslint-disable-next-line no-undef
				return Promise.reject(response);
			}
		},
		function (error) {
			let response = {
				data: { result: false, error: { code: '-1', message: 'Something went wrong connecting to server' } },
			};

			if (isObject(error.response)) {
				response = { ...error.response, ...response };

				if (isObject(error.response.data)) {
					response.data = { ...response.data, ...error.response.data };
				}
			}
			subscriptions.error.forEach((error) => error.function(response));

			// eslint-disable-next-line no-undef
			return Promise.reject(response);
		}
	);
}
