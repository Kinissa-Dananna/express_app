const db = require('../db/config');
const Search = {};
const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DATE = '20171025';

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
    console.log(res.locals.latLong);
    next();
  });
}

Search.findOneBarData = (req, res, next) => {
  const barId = req.params.barId;
  // let name, address, price, rating, hereNow;

  axios.get(
      `https://api.foursquare.com/v2/venues/${barId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}`
  ).then(response => {

      const name = response.data.response.venue.name,
      street = response.data.response.venue.location.formattedAddress[0],
      city = response.data.response.venue.location.formattedAddress[1],
      country = response.data.response.venue.location.formattedAddress[2],
      lat = response.data.response.venue.location.lat,
      long = response.data.response.venue.location.lng,
      price = response.data.response.venue.price ? response.data.response.venue.price.message : 'N/A',
      rating = response.data.response.venue.rating,
      description = response.data.response.venue.description ? response.data.response.venue.description : 'No description available.',
      daysOpen = response.data.response.venue.hours ? response.data.response.venue.hours.timeframes[0].days : 'Not Found',
      hoursOpen = response.data.response.venue.hours ? response.data.response.venue.hours.timeframes[0].open[0].renderedTime : 'Not Found',
      hoursUntilClosed = response.data.response.venue.hours ? response.data.response.venue.hours.status : 'Not Found',
      isOpen = response.data.response.venue.hours ? response.data.response.venue.hours.isOpen : 'Not Found',
      url = response.data.response.venue.canonicalUrl;

      const arrayResults = {
        name: name,
        address: {
          street: street,
          city: city,
          country: country
        },
        lat: lat,
        long: long,
        price: price,
        rating: rating,
        description: description,
        daysOpen: daysOpen,
        hoursOpen: hoursOpen,
        hoursUntilClosed: hoursUntilClosed,
        isOpen: isOpen,
        url: url
      }
      res.locals.arrayResults = arrayResults;
      next();
  }).catch(err => console.log('error in Bars.findOneBarData', err));

}


module.exports = Search;
