const _ = require("lodash");

// combine confirmed, recovered, and dead stats of the same country
// in the single object
exports.aggregateStats = ({
	countries,
	confirmedData,
	recoveredData,
	deadData,
}) => {
	let stats = [];
	// keys in our data objects are dates
	// retreiving object key return an array of all available dates
	let dates = _.keys(confirmedData[0]);
	// remove the first entry in the array
	// because in the contains a country name and not a date
	dates = dates.slice(1, dates.length);
	// loop therough the countries list
	for (let country of countries) {
		// confirmed cases data corressponding to the current country
		let currentCountryConfirmed = filterByCountry(country, confirmedData);
		// recovered cases data corressponding to the current country
		let currentCountryRecovered = filterByCountry(country, recoveredData);
		// deaths data corressponding to the current country
		let currentCountryDead = filterByCountry(country, deadData);

		// previous Date data object in used to cach facts objects
		// it's later used to calculte daily fact changes ( stat differences between yesterday and today )
		let prevDateData = false;
		// loop through all availbale dates
		for (let date of dates) {
			// confirmed case in the current country on the current date
			let confirmed = currentCountryConfirmed[date];
			let recovered = currentCountryRecovered[date];
			let dead = currentCountryDead[date];
			// convert date to ISO date format
			let isoDate = toIsoDate(date);
			// construct the fact object
			let statsObj = {
				territory: country.toLowerCase(),
				date: isoDate,
				confirmed,
				newConfirmed: prevDateData
					? confirmed - prevDateData.confirmed
					: false,
				recovered,
				newRecovered: prevDateData
					? recovered - prevDateData.recovered
					: false,
				dead,
				newDead: prevDateData ? dead - prevDateData.dead : false,
				active: confirmed - recovered - dead,
				newActive: prevDateData
					? confirmed - recovered - dead - prevDateData.active
					: false,
			};
			// cach current date's facts object
			prevDateData = statsObj;
			// push facts objects to the stats object
			stats.push(statsObj);
		}
	}
	return { aggregatedStats: stats, datesList: dates };
};

function filterByCountry(country, data) {
	let res = data.find((elem) => elem["Country/Region"] === country);
	return res;
}

exports.getDatesList = (data) => {
	let dates = _.keys(data[0]);
	dates = dates.slice(1, dates.length);
	return dates.map((date) => toIsoDate(date));
};

function toIsoDate(date) {
	let isoDate = date.split("/").reverse();
	let month = isoDate[2].length === 2 ? isoDate[2] : "0" + isoDate[2];
	let day = isoDate[1].length === 2 ? isoDate[1] : "0" + isoDate[1];
	return `${isoDate[0]}20-${month}-${day}`;
}
