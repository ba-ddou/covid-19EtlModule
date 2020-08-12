const { groupByCountry, getUniqueCountries } = require("./lib/groupByCountry");
const { aggregateStats, getDatesList } = require("./lib/aggregateStats");
const { normalize } = require("./lib/normalize");
const { syncCountryNames } = require("./lib/syncCountryNames");
const _ = require("lodash");
const data = require("./data");

async function run() {
	// get Ccountry grouped confirmed cases data
	let confirmedData = await groupByCountry(
		`${__dirname}/db/COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
	);
	// get Ccountry grouped recovered cases data
	let recoveredData = await groupByCountry(
		`${__dirname}/db/COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv`
	);
	// get Ccountry grouped deaths data
	let deadData = await groupByCountry(
		`${__dirname}/db/COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv`
	);
	// available countries list
	let countries = getUniqueCountries(confirmedData);
	console.log("run -> countries", countries);
	// merge confirmed, recovered, and deaths data of the same country
	// into the same object
	let { aggregatedStats } = aggregateStats({
		countries: countries,
		confirmedData,
		recoveredData,
		deadData,
	});
	// get available dates list
	let datesList = getDatesList(confirmedData);
	let { dates, territories, stats } = normalize({
		countries,
		aggregatedStats,
		datesList,
	});

	// There are many differences the country name spelling between
	// the covid-19 data source and the data used to draw the global
	// MAP component in the dashboard's UI.
	// I attempted to sync some of the differences manually, and this functions
	// fixes some of the country names in the countries data set to be the same
	// as the ones used in the MAP component
	territories = syncCountryNames({ territories });
	// save dates data ( table ) as a json file
	data.update("exports/dates", dates);
	// save coutries data ( table ) as a json file
	data.update("exports/territories", territories);
	// save facts data ( table ) as a josn file
	data.update("exports/stats", stats);
}

run();
