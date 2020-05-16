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
		// if (country == "Canada") console.log(uniqueCountryData);
		let res = uniqueCountryData.reduce((accumulator, currentValue) => {
			delete currentValue["Province/State"];
			delete currentValue["Country/Region"];
			delete currentValue["Lat"];
			delete currentValue["Long"];
			// console.log("**************************************");
			return _.mergeWith(
				accumulator,
				currentValue,
				(objValue, srcValue) => {
					// if (country == "Canada") {
					// 	console.log(
					// 		typeof objValue,
					// 		objValue,
					// 		typeof srcValue,
					// 		srcValue,
					// 		parseInt(objValue) + parseInt(srcValue)
					// 	);
					// }
					if (objValue)
						return parseInt(objValue) + parseInt(srcValue);
					else return parseInt(srcValue);
				}
			);
		}, {});

		groupedData.push({ "Country/Region": country, ...res });
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
