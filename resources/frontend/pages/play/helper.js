import { windowResponse } from 'frontend/utils/helper';

let postMessageHandlerWrapper = () => {
	let allowedOrigin = windowResponse() ? windowResponse().data.url : '';

	return function ({ data, origin }) {
		let originUrl = new URL(origin);
		let gameUrl = new URL(allowedOrigin);

		if ((gameUrl.origin == originUrl.origin || window.location.host == originUrl.host) && data == 'closeGame') {
			window.location.href = '/';
		}
	};
};

let postMessageHandler = postMessageHandlerWrapper();

export { postMessageHandler, windowResponse };
