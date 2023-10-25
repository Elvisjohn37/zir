import { componentModuleMock } from 'frontend/tests/helpers';
module.exports = componentModuleMock(jest.createMockFromModule('../SearchBar'), 'SearchBar', {
	elementToUse: {
		default: 'input',
	},
});
