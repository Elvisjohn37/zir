import React from 'react';
import SearchBar from './SearchBar';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@mui/material/Paper');
jest.mock('@mui/material/IconButton');
jest.mock('@mui/material/InputBase');
jest.mock('@mui/icons-material/Search');
jest.mock('frontend/utils/helper');
jest.mock('react-intl');

describe('<SearchBar/>', () => {
	it('should match snapshot', () => {
		let { asFragment } = render(<SearchBar onChange={jest.fn()} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should start search when user input any text', () => {
		let onChangeFn = jest.fn();
		let { getByTestId } = render(<SearchBar onChange={onChangeFn} />);
		let searchInput = getByTestId('InputBase');
		userEvent.type(searchInput, 'test');

		expect(onChangeFn).toHaveBeenCalledTimes(4);
		expect(onChangeFn).toHaveBeenNthCalledWith(1, { target: { value: 't' } });
		expect(onChangeFn).toHaveBeenNthCalledWith(2, { target: { value: 'te' } });
		expect(onChangeFn).toHaveBeenNthCalledWith(3, { target: { value: 'tes' } });
		expect(onChangeFn).toHaveBeenNthCalledWith(4, { target: { value: 'test' } });
	});

	it('should start search when user click search button ', () => {
		let onChangeFn = jest.fn();
		let { getByTestId } = render(<SearchBar onChange={onChangeFn} />);
		let searchButton = getByTestId('IconButton');
		userEvent.click(searchButton);

		expect(onChangeFn).toHaveBeenCalledTimes(1);
		expect(onChangeFn).toHaveBeenNthCalledWith(1, { target: { value: '' } });
	});
});
