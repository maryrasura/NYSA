// this file determines how deadly a certain location is when taking into account meteor crashes
// the danger of a location equals the sum of the dangers of individual meteorites to it
// the danger of a meteorite to a location equals its mass divided by the distance squared
// then, take the base-10 log of that and reduce by 15 to make it managable
// most values are between 1 and 2

const haversine = require("haversine"); // finds the distance between 2 points
const landings = require("./landings.json"); // NASA meteor crash data

// for convenience
const square = x => Math.pow(x, 2);
const add = (a, b) => a + b;
const identity = a => a;

// extracts the needed data from the NASA data and gives the properties names
const Meteorite = (data) => ({
	name: data[8],
	mass: parseInt(data[12]),
	latitude: parseFloat(data[15]),
	longitude: parseFloat(data[16])
});

// save the meteorite landings data, ignoring landings for which the location is unknown
const meteorites = landings
	.data
	.map(meteorite => Meteorite(meteorite))
	.filter(meteorite => meteorite.latitude && meteorite.longitude);

const dangerToLocation = (location) => Math.log10(meteorites
	.map(meteorite => meteorite.mass * square(haversine(meteorite, location)))
	.filter(identity)
	.reduce(add)) - 15;

module.exports = dangerToLocation;
