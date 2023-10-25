import React from 'react';
import { GamesThumbnail, GameTypeIcon } from './GameTypeIcon';
import { shallow } from 'enzyme';
import Button from '@mui/material/Button';
import Image from 'frontend/components/Image';

let wrapperGamesThumbnail, wrapperGameTypeIcon;

let testFunction = jest.fn();

beforeEach(() => {
	wrapperGamesThumbnail = shallow(<GamesThumbnail />);
	wrapperGameTypeIcon = shallow(<GameTypeIcon />);
});

//thumbnail="aztecRising.jpg"

afterEach(() => {
	wrapperGamesThumbnail.unmount();
	wrapperGameTypeIcon.unmount();
	jest.clearAllMocks();
});

describe('<GamesThumbnail />', () => {
	it('should render correctly', () => expect(wrapperGamesThumbnail).toMatchSnapshot());

	it('should execute onClick event after clicking the thumbnail', () => {
		wrapperGamesThumbnail.setProps({ onClick: testFunction });
		wrapperGamesThumbnail.find('.eventHandlerContainer').props().onClick();
		expect(testFunction).toHaveBeenCalled();
	});

	it('should display thumbnail image', () => {
		expect(wrapperGamesThumbnail.find(Image)).toHaveLength(1);
	});

	it('should display label if it is intended to display', () => {
		let withLabel = shallow(<GamesThumbnail label="test label" />);
		expect(withLabel.find('.label')).toHaveLength(1);
		expect(wrapperGamesThumbnail.find('.label')).toHaveLength(0);
	});
});

describe('<GameTypeIcon />', () => {
	it('should render correctly', () => expect(wrapperGamesThumbnail).toMatchSnapshot());

	it('should execute onClick event after clicking the game type icon', () => {
		wrapperGameTypeIcon.setProps({ onClick: testFunction });
		wrapperGameTypeIcon.find('.eventHandlerContainer').props().onClick();
		expect(testFunction).toHaveBeenCalled();
	});

	it('should display thumbnail image', () => {
		expect(wrapperGameTypeIcon.find(Image)).toHaveLength(1);
	});

	// it('should notify that there is a new game', () => {});

	// it('should show a notification icon for new games', () => {});
});
