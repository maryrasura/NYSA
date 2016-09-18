var haversine = (function () {

  // convert to radians
  var toRad = function (num) {
    return num * Math.PI / 180
  }

  return function haversine (start, end, options) {
    options   = options || {}

    var radii = {
      km:    6371,
      mile:  3960,
      meter: 6371000
    }

    var R = options.unit in radii
      ? radii[options.unit]
      : radii.km

    var dLat = toRad(end.latitude - start.latitude)
    var dLon = toRad(end.longitude - start.longitude)
    var lat1 = toRad(start.latitude)
    var lat2 = toRad(end.latitude)

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    if (options.threshold) {
      return options.threshold > (R * c)
    }

    return R * c
  }

})();

var http = require("http");

var square = function(x) {return x * x;}

var location = {
  latitude: request.parameters.latitude,
  longitude: request.parameters.longitude
}

var limit = 1000; // how many meteorites
var landingDataURL = "https://data.nasa.gov/resource/y77d-th95.json?$limit=" + limit;
var landingData = http.request({ url: landingDataURL });

var meteoriteData = JSON.parse(landingData.body);
var danger = 0;
for (var i in meteoriteData) {
  var meteoriteDatum = meteoriteData[i];
  try {
    var meteorite = {
      mass: meteoriteDatum.mass,
      latitude: meteoriteDatum.geolocation.coordinates[0],
      longitude: meteoriteDatum.geolocation.coordinates[1]
    };
    if (meteorite.mass / square(haversine(meteorite, location))) {
      danger += meteorite.mass / square(haversine(meteorite, location));
    }
  } catch (exception) {}
}

return danger;
