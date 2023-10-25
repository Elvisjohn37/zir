import { getError } from './errorData';
let { isFunction } = jest.requireActual('lodash');

let bannersData;

function getBannersData() {
	return bannersData;
}

function getBanners({ success, error }) {
	if (bannersData.data.result) {
		isFunction(success) && success(bannersData);
		return bannersData;
	} else {
		let errorData = getError();
		isFunction(error) && error(errorData);
		return errorData;
	}
}

function setGetBanners(result, data) {
	bannersData.data.result = result;
	bannersData.data.data = data;
}

function resetGetBanners() {
	bannersData = {
		data: {
			result: true,
			data: {
				bannerRso: 'http://rso-stg.stry628c.com/banner/',
				ad1: [
					{
						bannerImg: 'liveBlackJackAnnouncement.png',
						url: null,
						type: 2,
					},
				],
				ad2: [
					{
						bannerImg: 'liveBlackjackPromo.webm',
						url: null,
						type: 3,
					},
					{
						bannerImg: 'liveBaccaratPromo.webm',
						url: null,
						type: 3,
					},
					{
						bannerImg: 'liveRoulettePromo.webm',
						url: null,
						type: 3,
					},
					{
						bannerImg: 'liveSicboPromo.webm',
						url: null,
						type: 3,
					},
					{
						bannerImg: 'slotsPromo.webm',
						url: null,
						type: 3,
					},
					{
						bannerImg: 'cardGamesPromo.webm',
						url: null,
						type: 3,
					},
					{
						bannerImg: 'tableGamesPromo.webm',
						url: null,
						type: 3,
					},
					{
						bannerImg: 'videoGamesPromo.webm',
						url: null,
						type: 3,
					},
				],
				ad3: [
					{
						bannerImg: 'casino2.png',
						url: 'https://www.sbobet.com/games?cat=TableGames',
						type: 4,
					},
					{
						bannerImg: 'casino3.png',
						url: 'https://www.sbobet.com/games?cat=TableGames',
						type: 4,
					},
					{
						bannerImg: 'casino4.png',
						url: 'https://www.sbobet.com/games?cat=TableGames',
						type: 4,
					},
					{
						bannerImg: 'casino5.png',
						url: 'https://www.sbobet.com/games?cat=TableGames',
						type: 4,
					},
					{
						bannerImg: 'casino6.png',
						url: 'https://www.sbobet.com/games?cat=TableGames',
						type: 4,
					},
					{
						bannerImg: 'casino7.png',
						url: 'https://www.sbobet.com/games?cat=TableGames',
						type: 4,
					},
					{
						bannerImg: 'mobile1.png',
						url: '',
						type: 4,
					},
					{
						bannerImg: 'mobile2.png',
						url: '',
						type: 4,
					},
					{
						bannerImg: 'mobile3.png',
						url: '',
						type: 4,
					},
					{
						bannerImg: 'sportsbook1.png',
						url: 'https://www.sbobet.com/',
						type: 4,
					},
					{
						bannerImg: 'sportsbook2.png',
						url: 'https://www.sbobet.com/',
						type: 4,
					},
					{
						bannerImg: 'sportsbook3.png',
						url: 'https://www.sbobet.com/',
						type: 4,
					},
					{
						bannerImg: 'table1.png',
						url: '',
						type: 4,
					},
					{
						bannerImg: 'table2.png',
						url: '',
						type: 4,
					},
					{
						bannerImg: 'texaspoker1.png',
						url: 'https://www.kuncimerah.com/',
						type: 4,
					},
					{
						bannerImg: 'texaspoker2.png',
						url: 'https://www.kuncimerah.com/',
						type: 4,
					},
				],
				ad4: [
					{
						bannerImg: 'customerSupport.png',
						url: 'https://www.kuncimerah.com/',
						type: 5,
					},
				],
				ad5: [
					{
						bannerImg: '3populargamesminor1.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor2.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor3.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor4.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor5.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor6.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor7.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor8.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor5.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor6.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor7.png',
						url: '',
						type: 6,
					},
					{
						bannerImg: '3populargamesminor8.png',
						url: '',
						type: 6,
					},
				],
				ad6: [
					{
						bannerImg: 'mastercard.jpg',
						url: null,
						type: 7,
					},
					{
						bannerImg: 'maestro.jpg',
						url: null,
						type: 7,
					},
					{
						bannerImg: 'visaelectron.jpg',
						url: null,
						type: 7,
					},
					{
						bannerImg: 'visa.jpg',
						url: null,
						type: 7,
					},
					{
						bannerImg: 'mb.jpg',
						url: null,
						type: 7,
					},
					{
						bannerImg: 'neteller.jpg',
						url: null,
						type: 7,
					},
					{
						bannerImg: 'bankwire.jpg',
						url: null,
						type: 7,
					},
				],
			},
		},
	};
}
resetGetBanners();

module.exports = { getBanners, setGetBanners, resetGetBanners, getBannersData };
