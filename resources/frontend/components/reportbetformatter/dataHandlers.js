const eventDescription = {
	D: 'denied',
	R: 'running',
	L: 'lose',
	W: 'won',
	V: 'voided',
	P: '--',
	A: '--',
	X: 'rejected',
	O: 'draw',
	B: 'aborted',
};

let getEventDescription = () => eventDescription;

export default { getEventDescription };
