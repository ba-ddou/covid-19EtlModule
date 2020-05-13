const { groupByCountry, getUniqueCountries } = require("./lib/groupByCountry");
const { aggregateStats, getDatesList } = require("./lib/aggregateStats");
const { normalize } = require("./lib/normalize");
const _ = require("lodash");
const data = require("./data");

async function run() {
	let confirmedData = await groupByCountry(
		`${__dirname}\\db\\time_series_covid19_confirmed_global.csv`
	);
	let recoveredData = await groupByCountry(
		`${__dirname}\\db\\time_series_covid19_recovered_global.csv`
	);
	let deadData = await groupByCountry(
		`${__dirname}\\db\\time_series_covid19_deaths_global.csv`
	);

	let countries = getUniqueCountries(confirmedData);
	let { aggregatedStats } = aggregateStats({
		countries: countries,
		confirmedData,
		recoveredData,
		deadData,
	});
	let datesList = getDatesList(confirmedData);
	let { dates, territories, stats } = normalize({
		countries,
		aggregatedStats,
		datesList,
	});
	data.create("dates", dates);
	data.create("territories", territories);
	data.create("stats", stats);
}

run();
