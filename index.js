const { groupByCountry, uniqueCountries } = require("./lib/groupByCountry");
const _ = require("lodash");
const data = require("./data");

// groupByCountry(`${__dirname}\\db\\time_series_covid19_confirmed_global.csv`);

// groupByCountry(`${__dirname}\\db\\time_series_covid19_deaths_global.csv`);

// groupByCountry(`${__dirname}\\db\\time_series_covid19_recovered_global.csv`);

async function run() {
	let res = await groupByCountry(
		`${__dirname}\\db\\time_series_covid19_confirmed_global.csv`
	);
	await data.create("confirmedData", res);
}

run();

// let confirmedCountries = await uniqueCountries(
// 	`${__dirname}\\db\\time_series_covid19_confirmed_global.csv`
// );
// console.log("confirmedCountries", confirmedCountries.length);
// // await data.create("confirmedCountries", confirmedCountries);

// let deathsCountries = await uniqueCountries(
// 	`${__dirname}\\db\\time_series_covid19_deaths_global.csv`
// );
// console.log("deathsCountries", deathsCountries.length);
// // await data.create("deathsCountries", deathsCountries);

// let recoveredCountries = await uniqueCountries(
// 	`${__dirname}\\db\\time_series_covid19_recovered_global.csv`
// );
// console.log("recoveredCountries", recoveredCountries.length);
// // await data.create("recoveredCountries", recoveredCountries);

// console.log("confirmedCountries, recoveredCountries");
// console.log(_.xor(confirmedCountries, recoveredCountries));
// console.log("deathsCountries, recoveredCountries");
// console.log(_.xor(deathsCountries, recoveredCountries));
