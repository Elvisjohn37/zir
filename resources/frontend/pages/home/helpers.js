let setBannerRsoUrl = function (datas, rsoUrl) {
	return datas.map((data) => ({ ...data, bannerImg: `${rsoUrl}${data.bannerImg}` }));
};

let createBannerRsoUrl = function ({ assets, rsoUrl, lang, type }) {
	return assets.map((asset) => ({ ...asset, bannerImg: `${rsoUrl}${type}_${lang}/${asset.bannerImg}` }));
};

export { setBannerRsoUrl, createBannerRsoUrl };
