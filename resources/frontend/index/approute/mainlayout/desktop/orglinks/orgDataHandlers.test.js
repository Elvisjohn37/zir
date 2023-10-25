import orgDataHandlers from './orgDataHandlers';

describe('orgDataHandlers', () => {
	let expectedOrgKey = ['name', 'img', 'url', 'scaleWidth', 'scaleHeight'];
	let organization = orgDataHandlers.getOrganizations();

	it('should return array of object and correct key of data organization', () => {
		expect(Array.isArray(organization)).toBeTruthy();

		expect(Object.keys(organization[0])).toEqual(expect.arrayContaining(expectedOrgKey));
		expect(Object.keys(organization[1])).toEqual(expect.arrayContaining(expectedOrgKey));
	});
});
