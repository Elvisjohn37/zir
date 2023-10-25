import gifInfo from 'gif-info';

export default async function gifDurations(urls) {
	let gifURLs = [].concat(urls);

	let promisedUrls = gifURLs.map(async (url) => {
		let buffer = await fetch(url).then((res) => res.arrayBuffer());
		let duration = await gifInfo(buffer).duration;
		return { url, duration };
	});

	return await Promise.all(promisedUrls);
}
