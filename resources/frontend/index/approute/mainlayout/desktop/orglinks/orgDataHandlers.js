import pagcor from 'frontend/assets/images/organizationlink/pagcor.png';
import iomCrest from 'frontend/assets/images/organizationlink/isle_of_man.png';
import gamcare from 'frontend/assets/images/organizationlink/gamcare.png';
import eightenplus from 'frontend/assets/images/organizationlink/18plus.png';

const MNL_ORGANIZATIONS = [
	{
		name: 'pagcor',
		img: pagcor,
		url: '//pagcor.ph',
		scaleWidth: 1,
		scaleHeight: 1,
	},
	{
		name: 'gamcare',
		img: gamcare,
		url: '//www.gamcare.org.uk',
		scaleWidth: 95,
		scaleHeight: 102,
	},
	{
		name: 'eightenplus',
		img: eightenplus,
		scaleWidth: 95,
		scaleHeight: 102,
	},
];

const IOM_ORGANIZATIONS = [
	{
		name: 'iomCrest',
		img: iomCrest,
		url: '//www.gov.im/gambling',
		scaleWidth: 1,
		scaleHeight: 1,
	},
	{
		name: 'gamcare',
		img: gamcare,
		url: '//www.gamcare.org.uk',
		scaleWidth: 95,
		scaleHeight: 102,
	},
	{
		name: 'eightenplus',
		img: eightenplus,
		scaleWidth: 95,
		scaleHeight: 102,
	},
];

const BSI_ORGANIZATIONS = [
	{
		name: 'gamcare',
		img: gamcare,
		url: '//www.gamcare.org.uk',
		scaleWidth: 95,
		scaleHeight: 102,
	},
	{
		name: 'eightenplus',
		img: eightenplus,
		scaleWidth: 95,
		scaleHeight: 102,
	},
];

function getOrganizations(jurisdiction) {
	switch (jurisdiction) {
		case 'MNL':
			return MNL_ORGANIZATIONS;
		case 'IOM':
			return IOM_ORGANIZATIONS;
		case 'BSI':
			return BSI_ORGANIZATIONS;
	}
}

export default { getOrganizations };
