// add all required files
const axios = require('axios');
const db = require('../db/config');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DATE = '20171025';
// create the model object
const Bars = {}


Bars.findAllByEventId = (req, res, next) => {
    const eventId = req.params.eventId;
    db.manyOrNone(
        'SELECT * FROM bars WHERE eventId=$1', [eventId] // use the id here
    ).then(data => {
    //console.log(data);
        res.locals.bars = data;
        next();
    });
};

Bars.findAllBarData = (req, res, next) => {
  const bars = res.locals.bars;
  let barDataCalls = [];

  bars.forEach((bar) => {
    let barId = bar.barid;
    barDataCalls.push(axios.get(`https://api.foursquare.com/v2/venues/${barId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}`));
  });
  axios.all(barDataCalls)
    .then(response => {
      res.locals.arrayResults = [];
      response.forEach((response) => {
        let arrayResults = [];
        name = response.data.response.venue.name;
        address = response.data.response.venue.location.address;
        price = response.data.response.venue.price.message;
        rating = response.data.response.venue.rating;
        hereNow = response.data.response.venue.hereNow.count;
        if(hereNow === 0) { hereNow = response.data.response.venue.hereNow.summary; }
        arrayResults.push({
          name: name,
          address: address,
          price: price,
          rating: rating,
          hereNow: hereNow
        })
        res.locals.arrayResults.push(arrayResults);
      })
      next();
    })
}

Bars.findOneBarById = (req, res, next) => {
  const eventId = req.params.eventId;
    const id = req.params.id;
  db.one(`SELECT * FROM bars WHERE eventId = $1 AND id = $2`, [eventId, id])
    .then(data => {
      res.locals.bar = data;
      next();
    })
    .catch(err => console.log(err))
}

Bars.findOneBarData = (req, res, next) => {
  const barId = res.locals.bar.barid;
  let arrayResults = [];
  let name, address, price, rating, hereNow;

  axios.get(
      `https://api.foursquare.com/v2/venues/${barId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}`
  ).then(response => {
//    console.log(response.data.response);
      //const barData = response.data.response;
      //res.locals.barData = barData;
      name = response.data.response.venue.name;
      console.log('name', name);
      address = response.data.response.venue.location.address;
      price = response.data.response.venue.price.message;
      rating = response.data.response.venue.rating;
      hereNow = response.data.response.venue.hereNow.count;
      if(hereNow === 0) { hereNow = response.data.response.venue.hereNow.summary; }
      arrayResults.push({
        name: name,
        address: address,
        price: price,
        rating: rating,
        hereNow: hereNow
      })
      res.locals.arrayResults = arrayResults;
      next();
  }).catch(err => console.log('error in Bars.findOneBarData', err));

}

Bars.searchNearbyBars = (req, res, next) => {
    console.log('search');
    const lat = res.locals.latLong.lat;
    const long = res.locals.latLong.lng;
    axios.get(
        `https://api.foursquare.com/v2/venues/search?ll=${lat},${long}&categoryId=4d4b7105d754a06376d81259&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}&limit=5`
    ).then(response => {
         const fiveResults = response.data.response.venues;
         res.locals.fiveResults = fiveResults.map( result => {
           return {barId: result.id, name: result.name, lat: result.location.lat, long: result.location.lng}
         });
        next();
    }).catch(err => console.log('error in places.search ', err));
}

Bars.searchBars = (req, res, next) => {
    console.log('search');
    const  searchTerm  = req.params.barQuery;
    const lat = res.locals.latLong.lat;
    const long = res.locals.latLong.lng;
    axios.get(
        `https://api.foursquare.com/v2/venues/search?ll=${lat},${long}&query=${searchTerm}&categoryId=4d4b7105d754a06376d81259&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}&limit=5`
    ).then(response => {
         const fiveResults = response.data.response.venues;
         res.locals.fiveResults = fiveResults.map( result => {
           return {barId: result.id, name: result.name, lat: result.location.lat, long: result.location.lng}
         });
        next();
    }).catch(err => console.log('error in places.search ', err));
}

//--------------------------------------------------------------
//--------------------------- API ROUTES ---------------------
//--------------------------------------------------------------

Bars.create = (req, res, next) => {
  const eventId = req.params.eventId;
  console.log(eventId);
 // const eventId = req.body.eventId,
  const  barId = req.body.barId,
        lat = req.body.lat,
        long = req.body.long,
        name = req.body.name;
  db.one(
    'INSERT INTO bars (eventId, barId, lat, long, name) VALUES ($1, $2, $3, $4, $5) returning id',
    [eventId, barId, lat, long, name]
  ).then(data => {
    console.log('Data: ' + data);
    res.locals.arrayResults = data;
    next();
  }).catch(err => console.log('error posting bar ', err));

}


Bars.destroy = (req, res, next) => {
    const { eventId } = req.params;
    const id = Number(req.params.id);
    db.none(
        'DELETE FROM bars WHERE eventId = $1 AND id = $2', [eventId, id]
    ).then(() => {
        next();
    });
};

// export the model
module.exports = Bars;
