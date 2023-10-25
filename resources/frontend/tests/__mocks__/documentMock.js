module.exports = function documentMock() {
	Object.assign(global.document, {
		querySelector: (selector) => ({
			getAttribute: (attribute) => {
				return selector + attribute;
			},
		}),
	});
};
