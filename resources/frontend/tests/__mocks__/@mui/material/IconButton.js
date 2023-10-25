import { componentModuleMock } from 'frontend/tests/helpers';
module.exports = componentModuleMock(jest.createMockFromModule('@mui/material/IconButton'), 'IconButton', {
	elementToUse: {
		default: 'button',
	},
});
