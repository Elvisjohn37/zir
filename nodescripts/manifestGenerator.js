module.exports = (entrypoints, publicPath) => {
	let groupedEntryPoints = {};

	for (let name in entrypoints) {
		groupedEntryPoints[name] = {
			js: entrypoints[name]
				.filter(file_name => file_name.endsWith('.js'))
				.map(file_name => publicPath + file_name),
			css: entrypoints[name]
				.filter(file_name => file_name.endsWith('.css'))
				.map(file_name => publicPath + file_name)
		};
	}

	return groupedEntryPoints;
};
