import { extractProductGameType } from '../gamerules/helper';

const TEST_DATA_1 = [
	{
		gameName: 'Dice Wars (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Djap Go (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Sedie (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Three Stars Blessing (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: "Whack d' Mole (Mobile)",
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Three Card Poker (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: 'Dragon Tiger (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: '3 Faces Baccarat (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: 'Mystic Cards (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: 'Yin Yang Treasure (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
];
const RESULT_DATA_1 = [
	{
		productName: 'Games',
		gameTypes: ['Table Games', 'Card Games'],
	},
];

const TEST_DATA_2 = [
	{
		gameName: 'Dice Wars (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Djap Go (Mobile)',
		productName: 'Multiplayer',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Sedie (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Three Stars Blessing (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: "Whack d' Mole (Mobile)",
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Three Card Poker (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: 'Dragon Tiger (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: '3 Faces Baccarat (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: 'Mystic Cards (Mobile)',
		productName: 'Games',
		gameTypeName: 'Card Games',
	},
	{
		gameName: 'Yin Yang Treasure (Mobile)',
		productName: 'Games',
		gameTypeName: 'Table Games',
	},
	{
		gameName: 'Djap Go 2 (Mobile)',
		productName: 'Multiplayer',
		gameTypeName: 'Super Slots',
	},
];
const RESULT_DATA_2 = [
	{
		productName: 'Games',
		gameTypes: ['Table Games', 'Card Games'],
	},
	{
		productName: 'Multiplayer',
		gameTypes: ['Table Games', 'Super Slots'],
	},
];

describe('extractProductGameType()', () => {
	it('should group product and game type into array', () => {
		expect(extractProductGameType(TEST_DATA_1)).toEqual(RESULT_DATA_1);
		expect(extractProductGameType(TEST_DATA_2)).toEqual(RESULT_DATA_2);
	});
});
