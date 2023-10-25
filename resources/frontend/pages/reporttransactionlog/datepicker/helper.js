export function isArrowDisabled(arrow, currentHours) {
	switch (arrow) {
		case 'prev':
			if (currentHours <= 0) {
				return true;
			}
			return false;
		case 'next':
			if (currentHours >= 23) {
				return true;
			}
			return false;
	}
}

export function navigateTime(currentDate, setSelectedDate, setPrevArrow, setNextArrow, setRefresh, actions) {
	switch (actions) {
		case 'add':
			currentDate.setHours(currentDate.getHours() + 1);
			break;
		case 'sub':
			currentDate.setHours(currentDate.getHours() - 1);
			break;
	}
	var newDate = new Date(currentDate);

	setPrevArrow(isArrowDisabled('prev', newDate.getHours()));
	setNextArrow(isArrowDisabled('next', newDate.getHours()));

	setSelectedDate(newDate);
	setRefresh(true);
}
