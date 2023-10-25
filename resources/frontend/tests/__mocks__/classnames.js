module.exports = (arg) => {
	try {
		return arg.filter((value) => value).join(' ');
	} catch (e) {
		//console.log(arg);
	}
};
