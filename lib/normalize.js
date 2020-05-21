// normalize fact objects by exporting dates and countries into
// their seperate data set ( Objects Array that is later gonna be stored as a MySQL table )
exports.normalize = ({ countries, aggregatedStats, datesList }) => {
	let dates = [];
	let territories = [];
	let stats = [];

	// assign IDs to dates
	dates = datesList.map((elem, index) => ({
		id: index,
		date: elem,
	}));
	// console.log(dates);

	// assign IDs to countries
	territories = countries.map((elem, index) => ({
		id: index,
		name: elem.toLowerCase(),
	}));

	// Replace dates and countries in the Facts Objects Array
	// with their corressponding IDs
	stats = aggregatedStats.map((stat) => {
		stat.date = dates.find((date) => date.date === stat.date).id;
		stat.territory = territories.find(
			(territory) => territory.name === stat.territory
		).id;
		return stat;
	});

	return { dates, territories, stats };
};
