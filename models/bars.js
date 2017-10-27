// add all required files
const axios = require('axios');
const db = require('../db/config');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const DATE = '20171025';
const GOOGLE_API = process.env.GOOGLE_API;
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

// get foursquare info dump about a bar
Bars.findOneBarData = (req, res, next) => {
  const barId = res.locals.bar.barid;
  // let name, address, price, rating, hereNow;

  axios.get(
      `https://api.foursquare.com/v2/venues/${barId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}`
  ).then(response => {
      console.log(response.data);
      const name = response.data.response.venue.name,
      street = response.data.response.venue.location.formattedAddress[0],
      city = response.data.response.venue.location.formattedAddress[1],
      country = response.data.response.venue.location.formattedAddress[2],
      lat = response.data.response.venue.location.lat,
      long = response.data.response.venue.location.lng,
      price = response.data.response.venue.price ? response.data.response.venue.price.message : 'N/A',
      rating = response.data.response.venue.rating,
      description = response.data.response.venue.description ? response.data.response.venue.description : 'No description available.',
      daysOpen = response.data.response.venue.hours ? response.data.response.venue.hours.timeframes[0].days : 'N/A',
      hoursOpen = response.data.response.venue.hours ? response.data.response.venue.hours.timeframes[0].open[0].renderedTime : '',
      hoursUntilClosed = response.data.response.venue.hours ? response.data.response.venue.hours.status : '',
      isOpen = response.data.response.venue.hours ? response.data.response.venue.hours.isOpen : '',
      url = response.data.response.venue.canonicalUrl;
      map =  `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API}&q=${name}`;

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
        url: url,
        map: map
      }
      res.locals.arrayResults = arrayResults;
      next();
  }).catch(err => console.log('error in Bars.findOneBarData', err));

}
//
// Bars.getBarMap = (req, res, next) => {
//   const lat = res.locals.arrayResults.lat,
//         long = res.locals.arrayResults.long,
//         name = res.locals.arrayResults.name;
//
//
//     const map =  `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&markers=color:red%7Clabel:${name}%7C${lat},${long}&zoom=14&size=400x400&key=${GOOGLE_API}`;
//     res.locals.map = map;
//     next();
//
// }

Bars.searchNearbyBars = (req, res, next) => {
    console.log('search');
    const lat = res.locals.latLong.lat;
    const long = res.locals.latLong.lng;
    axios.get(
        `https://api.foursquare.com/v2/venues/search?ll=${lat},${long}&categoryId=4d4b7105d754a06376d81259&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}&limit=10&radius=1500`
    ).then(response => {
         const fiveResults = response.data.response.venues;
         res.locals.fiveResults = fiveResults.map( result => {
           return {barId: result.id, name: result.name, lat: result.location.lat, long: result.location.lng}
         });
         console.log(res.locals.fiveResults);
        next();
    }).catch(err => console.log('error in places.search ', err));
}

Bars.searchBars = (req, res, next) => {
    console.log('search');
    const  searchTerm  = req.params.barQuery;
    const lat = res.locals.latLong.lat;
    const long = res.locals.latLong.lng;
    axios.get(
        `https://api.foursquare.com/v2/venues/search?ll=${lat},${long}&query=${searchTerm}&categoryId=4d4b7105d754a06376d81259&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}&limit=10`
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
