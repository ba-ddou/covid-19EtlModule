const _ = require("lodash");

exports.aggregateStats = ({
	countries,
	confirmedData,
	recoveredData,
	deadData,
}) => {
	let stats = [];
	let dates = _.keys(confirmedData[0]);
	dates = dates.slice(1, dates.length);
	// console.log(dates);
	for (let country of countries) {
		let currentCountryConfirmed = filterByCountry(country, confirmedData);
		let currentCountryRecovered = filterByCountry(country, recoveredData);
		let currentCountryDead = filterByCountry(country, deadData);

		for (let date of dates) {
			let confirmed = currentCountryConfirmed[date];
			let recovered = currentCountryRecovered[date];
			let dead = currentCountryDead[date];
			let isoDate = toIsoDate(date);
			stats.push({
				territory: country.toLowerCase(),
				date: isoDate,
				confirmed,
				recovered,
				dead,
			});
		}
	}
	return { aggregatedStats: stats, datesList: dates };
};

function filterByCountry(country, data) {
	// console.log(country, data[0]);
	let res = data.find((elem) => elem["Country/Region"] === country);
	// console.log(country, res);
	return res;
}

exports.getDatesList = (data) => {
	let dates = _.keys(data[0]);
	dates = dates.slice(1, dates.length);
	return dates.map((date) => toIsoDate(date));
};

function toIsoDate(date) {
	// console.log("toIsoDate -> date", date);
	let isoDate = date.split("/").reverse();
	let month = isoDate[2].length === 2 ? isoDate[2] : "0" + isoDate[2];
	let day = isoDate[1].length === 2 ? isoDate[1] : "0" + isoDate[1];
	return `${isoDate[0]}20-${month}-${day}`;
}
