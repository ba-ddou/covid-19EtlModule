const fs = require("fs");
const neatCsv = require("neat-csv");
const _ = require("lodash");

exports.groupByCountry = async (filePath) => {
	let file = await fs.readFileSync(filePath);
	let data = await neatCsv(file);
	let uniqueCountries = _.sortedUniq(
		data.map((elem) => elem["Country/Region"])
	);

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
	console.log("uniqueCountries Length", uniqueCountries.length);
	console.log("groupedData Length", groupedData.length);
	return groupedData;
};

exports.uniqueCountries = async (filePath) => {
	let file = await fs.readFileSync(filePath);
	let data = await neatCsv(file);
	let uniqueCountries = _.sortedUniq(
		data.map((elem) => elem["Country/Region"])
	);
	return uniqueCountries;
};

// let arr = [
// 	{
// 		country: "morocco",
// 		x: 15,
// 		y: 25,
// 		tkharbi9: "fghjk",
// 	},
// 	{
// 		country: "morocco",
// 		x: 10,
// 		y: 15,
// 		tkharbi9: "dfghujko",
// 	},
// 	{
// 		country: "morocco",
// 		x: 25,
// 		y: 10,
// 		tkharbi9: "rtfgyhuj",
// 	},
// ];

// let res = arr.reduce((accumulator, currentValue) => {
// 	delete currentValue["tkharbi9"];
// 	return _.mergeWith(accumulator, currentValue, (objValue, srcValue) => {
// 		if (typeof objValue === "number") return objValue + srcValue;
// 	});
// }, {});

// console.log(res);
