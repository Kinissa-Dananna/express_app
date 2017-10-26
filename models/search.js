const db = require('../db/config');
const Search = {};
const axios = require('axios');

// autocomplete search results - provides description for display and place id for getting lat and long data
Search.populateResults = (req, res, next) => {
  const query = req.params.query;
  axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&&key=${process.env.PLACES_KEY}`)
  .then(response => {
    res.locals.results = response.data.predictions.map(prediction => {
      const result = {
        description: prediction.description,
        placeId: prediction.place_id
      }
      return result;
    });
    //console.log(res.locals.results);
    next();
  });
}
// get place id for the first result when a user doesn't choose an autocomplete option
Search.getFirstResult = (req, res, next) => {
  const query = req.params.query;
  axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&&key=${process.env.PLACES_KEY}`)
  .then(response => {
      const result = {
        description: response.data.predictions[0].description,
        placeId: response.data.predictions[0].place_id
      }
    res.locals.result = result;
    //console.log(res.locals.result);
    next();
  });
}
// get the lat and long for a user input
Search.getLatLongForInput = (req, res, next) => {
  const placeId = res.locals.result.placeId;
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.GEO_KEY}`)
  .then(response => {
    res.locals.latLong = response.data.results[0].geometry.location;
    res.locals.name = res.locals.result.description
    //console.log(res.locals.latLong);
    next();
  });
}

// gets lat long data from autocompleted search results
Search.getLatLong = (req, res, next) => {
  const placeId = req.params.placeId
  res.locals.name = req.body.name;
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${process.env.GEO_KEY}`)
  .then(response => {
    res.locals.latLong = response.data.results[0].geometry.location;
    //console.log(res.locals.latLong);
    next();
  });
}


module.exports = Search;
