const datasets = require('./datasets')
const geolocation = require('./geolocation')
const geoservice = require('./geoservice')
const error = require('./error')

module.exports = function notes(dataset, location, env) {
  var params = {
    "token": env.arcgisToken,
    "layerUrl": datasets('notes').url
  }

  return geolocation.geometry(location).then(function(geometry) {
    geometry.spatialReference = {"wkid": 4326}
    params.edits = {
      "adds": [{
        "attributes": {
          "Name": "Citizen",
          "Category": 2,
          "Location": location,
          "Comments": dataset
        },
        "geometry": geometry
      }]
    }
    return geoservice().modifyFeatures(params).then(function(features) {
      return Promise.resolve("Added note")
    }).catch(function(message) {
      return Promise.resolve(error[0])
    });
  })
}
