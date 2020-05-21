const fs = require("fs");
const neatCsv = require("neat-csv");
const _ = require("lodash");

function removeStateLevelDuplicates(Data) {
	// These countries' data is available for both the entire country and individual states
	// this was not dicovered by inspecting the data, it's mentionned in the data source's documentation
	let targets = ["Netherlands", "United Kingdom", "France", "Denmark"];

	// Remove State level data for all countries in the targets array
	return Data.filter((elem) => {
		let isATarget = targets.includes(elem["Country/Region"]);
		let isGlobal = elem["Province/State"] ? false : true;
		return !isATarget || isGlobal;
	});
}
// some countries's data is only provided at the state level
// statistics for the entire country is the sum of individual states's data
exports.groupByCountry = async (filePath) => {
	// read the target file
	let file = await fs.readFileSync(filePath);
	// convert CSV to a JS Object
	let data = await neatCsv(file);
	// remove state level data for target countries
	data = removeStateLevelDuplicates(data);
	// a list of all countries available in the document
	let uniqueCountries = getUniqueCountries(data);

	let groupedData = [];
	// loop through the countries list
	for (let country of uniqueCountries) {
		// get data entries corrensponding to the current country
		let uniqueCountryData = data.filter(
			(elem) => elem["Country/Region"] === country
		);
		// Merge all state level data object into a single object
		// representing the entire country.
		let res = uniqueCountryData.reduce((accumulator, currentValue) => {
			delete currentValue["Province/State"];
			delete currentValue["Country/Region"];
			delete currentValue["Lat"];
			delete currentValue["Long"];
			// mergeWith is a lodash function that merges two objects
			// by applying a function to object attributes with the same key
			// Example
			// _.mergeWith({ x: 15 , y: 5},{ x: 5 , y: 15},(p1,p2)=>p1+p2) --> { x: 20 , y: 20}
			return _.mergeWith(
				accumulator,
				currentValue,
				(objValue, srcValue) => {
					if (objValue)
						return parseInt(objValue) + parseInt(srcValue);
					else return parseInt(srcValue);
				}
			);
		}, {});

		// country name was removed to perform the merge
		// pushing the resulting country object to the groupedData array
		groupedData.push({
			"Country/Region": country, // adding back the country name
			...res,
		});
	}
	// calculate covid-19 statistics for the entire world
	let globalStats = computeGlobalStats(groupedData);
	return [globalStats, ...groupedData];
};

// merge all available countries's data to get global covid-19 statistics
function computeGlobalStats(stats) {
	let data = _.cloneDeep(stats);
	let res = data.reduce((accumulator, currentValue) => {
		delete currentValue["Country/Region"];
		return _.mergeWith(accumulator, currentValue, (objValue, srcValue) => {
			if (objValue) return parseInt(objValue) + parseInt(srcValue);
			else return parseInt(srcValue);
		});
	}, {});
	return { "Country/Region": "global", ...res };
}

// returns a list of all countries available
function getUniqueCountries(data) {
	let uniqueCountries = _.uniq(data.map((elem) => elem["Country/Region"]));
	return uniqueCountries;
}

exports.getUniqueCountries = getUniqueCountries;
