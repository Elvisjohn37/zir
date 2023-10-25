import { componentModuleMock } from 'frontend/tests/helpers';
module.exports = componentModuleMock(jest.createMockFromModule('../Video'), 'Video', {
	elementToUse: {
		default: 'video',
	},
});
