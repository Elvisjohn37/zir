import { isArrowDisabled, navigateTime } from './helper';
import { setDate } from 'frontend/tests/helpers';

describe('isArrowDisabled()', () => {
	it('should return true when arrow is previous and current hour is 12AM or less', () => {
		let prev1 = isArrowDisabled('prev', 1);
		let prev2 = isArrowDisabled('prev', 0);
		let prev3 = isArrowDisabled('prev', 23);
		let prev4 = isArrowDisabled('prev', -1);

		expect(prev1).toEqual(false);
		expect(prev2).toEqual(true);
		expect(prev3).toEqual(false);
		expect(prev4).toEqual(true);
	});
	it('should return true when arrow is next and current hour is 11PM or more', () => {
		let next1 = isArrowDisabled('next', 1);
		let next2 = isArrowDisabled('next', 0);
		let next3 = isArrowDisabled('next', 23);
		let next4 = isArrowDisabled('next', -1);
		let next5 = isArrowDisabled('next', 24);

		expect(next1).toEqual(false);
		expect(next2).toEqual(false);
		expect(next3).toEqual(true);
		expect(next4).toEqual(false);
		expect(next5).toEqual(true);
	});
});

describe('navigateTime()', () => {
	it('should navigate to next 1 hour to current time when action is to add time', () => {
		let dateNum = 920202140000;
		let date1 = setDate(dateNum);
		let setSelectedDate = jest.fn();
		let setPrevArrow = jest.fn();
		let setNextArrow = jest.fn();
		let setRefresh = jest.fn();
		navigateTime(date1, setSelectedDate, setPrevArrow, setNextArrow, setRefresh, 'add');

		let dateNum2 = 920202140001;
		let date2 = setDate(dateNum2);
		navigateTime(date2, setSelectedDate, setPrevArrow, setNextArrow, setRefresh, 'add');

		expect(date1.setHours).toHaveBeenCalledWith(dateNum + 1);
		expect(date2.setHours).toHaveBeenCalledWith(dateNum2 + 1);
		expect(setRefresh).toHaveBeenCalledTimes(2);
		expect(setRefresh).toHaveBeenNthCalledWith(1, true);
		expect(setRefresh).toHaveBeenNthCalledWith(2, true);
	});
	it('should navigate to previous 1 hour to current time when action is to substract time', () => {
		let dateNum = 920202140000;
		let date1 = setDate(dateNum);
		let setSelectedDate = jest.fn();
		let setPrevArrow = jest.fn();
		let setNextArrow = jest.fn();
		let setRefresh = jest.fn();
		navigateTime(date1, setSelectedDate, setPrevArrow, setNextArrow, setRefresh, 'sub');

		let dateNum2 = 920202140001;
		let date2 = setDate(dateNum2);
		navigateTime(date2, setSelectedDate, setPrevArrow, setNextArrow, setRefresh, 'sub');

		expect(date1.setHours).toHaveBeenCalledWith(dateNum - 1);
		expect(date2.setHours).toHaveBeenCalledWith(dateNum2 - 1);
		expect(setRefresh).toHaveBeenCalledTimes(2);
		expect(setRefresh).toHaveBeenNthCalledWith(1, true);
		expect(setRefresh).toHaveBeenNthCalledWith(2, true);
	});
	it('should check if next and previous arrow should be disabled', () => {
		let setSelectedDate = jest.fn();
		let setPrevArrow = jest.fn();
		let setNextArrow = jest.fn();
		let setRefresh = jest.fn();
		navigateTime(setDate(0), setSelectedDate, setPrevArrow, setNextArrow, setRefresh, 'sub');
		navigateTime(setDate(1), setSelectedDate, setPrevArrow, setNextArrow, setRefresh, 'sub');
		navigateTime(setDate(23), setSelectedDate, setPrevArrow, setNextArrow, setRefresh, 'sub');

		expect(setPrevArrow).toHaveBeenNthCalledWith(1, true);
		expect(setNextArrow).toHaveBeenNthCalledWith(1, false);
		expect(setPrevArrow).toHaveBeenNthCalledWith(2, false);
		expect(setNextArrow).toHaveBeenNthCalledWith(2, false);
		expect(setPrevArrow).toHaveBeenNthCalledWith(3, false);
		expect(setNextArrow).toHaveBeenNthCalledWith(3, true);
	});
});
