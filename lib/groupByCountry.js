const fs = require("fs");
const neatCsv = require("neat-csv");
const _ = require("lodash");

function removeStateLevelDuplicates(Data) {
	let targets = ["Netherlands", "United Kingdom", "France", "Denmark"];
	return Data.filter((elem) => {
		let isATarget = targets.includes(elem["Country/Region"]);
		let isGlobal = elem["Province/State"] ? false : true;
		return !isATarget || isGlobal;
	});
}

exports.groupByCountry = async (filePath) => {
	let file = await fs.readFileSync(filePath);
	let data = await neatCsv(file);
	data = removeStateLevelDuplicates(data);
	let uniqueCountries = getUniqueCountries(data);

	let groupedData = [];
	for (let country of uniqueCountries) {
		// console.log("exports.groupByCountry -> country", country);
		let uniqueCountryData = data.filter(
			(elem) => elem["Country/Region"] === country
		);
		let res = uniqueCountryData.reduce((accumulator, currentValue) => {
			delete currentValue["Province/State"];
			delete currentValue["Lat"];
			delete currentValue["Long"];
			return _.mergeWith(
				accumulator,
				currentValue,
				(objValue, srcValue) => {
					if (typeof objValue === "number")
						return objValue + srcValue;
				}
			);
		}, {});
		groupedData.push(res);
	}
	// console.log("uniqueCountries Length", uniqueCountries.length);
	// console.log("groupedData Length", groupedData.length);
	return groupedData;
};

function getUniqueCountries(data) {
	// let file = await fs.readFileSync(filePath);
	// let data = await neatCsv(file);
	let uniqueCountries = _.uniq(data.map((elem) => elem["Country/Region"]));
	return uniqueCountries.sort();
}

exports.getUniqueCountries = getUniqueCountries;
