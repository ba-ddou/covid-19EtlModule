const _ = require("lodash");
const data = require("../data");

// var territories = require("../data/territories.json");
// console.log("territories", territories.length);
var countries = require("../data/countries");
// console.log("countries", countries.length);

var territoriesNameChanges = require("../data/territoriesNameChanges.json");
var addToAutoComplete = require("../data/addToAutoComplete.json");

const crossReferecne = () => {
	let territoryNames = territories.map((elem) => elem.name);
	let countryNames = countries.map((elem) => elem.value);
	// console.log(
	// 	"missing from AutoComplete",
	// 	_.difference(territoryNames, countryNames)
	// );
	data.create(
		"missingFromAutoComplete",
		_.difference(territoryNames, countryNames)
	);
	// console.log(
	// 	"missing from territories",
	// 	_.difference(countryNames, territoryNames)
	// );
	data.create(
		"missingFromTerritories",
		_.difference(countryNames, territoryNames)
	);
};

const addMissingTerritories = () => {
	let newCountries = addToAutoComplete.map((elem) => ({
		value: elem,
		ISO_A2: "unset",
	}));
	countries = [...countries, ...newCountries];
	countries = _.sortBy(countries, ["value"]);
	// countries = countries.map(elem => {
	// 	elem.iso_a2 = elem.ISO_A2;
	// 	delete elem.ISO_A2;
	// 	return elem
	// });
	data.create("autoCompleteOptions", countries);
};

const syncCountryNames = ({ territories }) => {
	// console.log(territories);
	for (territory of territories) {
		let target = territoriesNameChanges.find(
			(elem) => elem.og === territory.name
		);
		if (target) {
			console.log(territory.name, target.new);
			territory.name = target.new;
		}
	}
	return territories;
};

// crossReferecne();
// addMissingTerritories();

exports.syncCountryNames = syncCountryNames;
