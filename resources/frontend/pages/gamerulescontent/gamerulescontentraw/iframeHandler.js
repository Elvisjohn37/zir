import { googleDocs } from 'frontend/ajax/google';

export function loadGoogleDocsIframe(iframe, url, callback) {
	googleDocs(
		url,
		(response) => {
			iframe.contentWindow.document.getElementsByTagName('html')[0].innerHTML = response.data;
			iframe.contentWindow.document.getElementsByTagName('head')[0].innerHTML = response.data;

			let srcollHeight = iframe.contentWindow.document.body.scrollHeight;
			iframe.style.height = `${srcollHeight}px`;
			iframe.contentWindow.document.body.style.background = 'transparent';

			callback.success && callback.success();
		},
		callback.error
	);
}
