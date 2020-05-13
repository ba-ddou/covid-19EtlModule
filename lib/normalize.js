exports.normalize = ({ countries, aggregatedStats, datesList }) => {
	let dates = [];
	let territories = [];
	let stats = [];

	dates = datesList.map((elem, index) => ({
		id: index,
		date: elem,
	}));
	// console.log(dates);

	territories = countries.map((elem, index) => ({
		id: index,
		name: elem,
	}));

	stats = aggregatedStats.map((stat) => {
		console.log(stat.territory);
		stat.date = dates.find((date) => date.date === stat.date).id;
		stat.territory = territories.find(
			(territory) => territory.name === stat.territory
		).id;
		return stat;
	});

	return { dates, territories, stats };
};
