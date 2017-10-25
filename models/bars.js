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
    db.one(
        'SELECT * FROM bars WHERE eventId=$1', [eventId] // use the id here
    ).then(data => {
    //console.log(data);
        res.locals.bars = data;
        next();
    });
};

// Bars.findAllBarData = (req, res, next) => {
//   const bars = res.locals.bars;
//   // const barId = req.params.barId;
//   // const lat = req.params.lat;
//   // const long = req.params.long;
//
//
//
// }

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

  axios.get(
      `https://api.foursquare.com/v2/venues/${barId}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}`
  ).then(response => {
//    console.log(response.data.response);
      const barData = response.data.response;
      res.locals.barData = barData;
      next();
  }).catch(err => console.log('error in Bars.findOneBarData', err));

}
//
// Bars.searchBars = (req, res, next) => {
//     console.log('search');
//     const { searchTerm } = req.params;
//     axios.post(
//         `https://api.foursquare.com/v2/venues/search?ll=40.741514,-73.989592&query=${searchTerm}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${DATE}`
//     ).then(response => {
//         // const fiveResults = response.data.predictions;
//         // res.locals.fiveResults = fiveResults;
//         next();
//     }).catch(err => console.log('error in places.search ', err));
// }

//--------------------------------------------------------------
//--------------------------- API ROUTES ---------------------
//--------------------------------------------------------------

// Bars.create = (req, res, next) => {
//   const eventId = req.body.eventId,
//         barId = req.body.barId,
//         lat = req.body.lat,
//         long = req.body.long,
//         name = req.body.name;
//   db.one(
//     'INSERT INTO bars (eventId, barId, lat, long, name) VALUES ($1, $2, $3, $4, $5) returning id',
//     [eventId, barId, lat, long, name]
//   ).then(data => {
//     console.log('Data: ' + data);
//     res.locals.newData = data;
//     next();
//   });
// }

// Bars.update = (req, res, next) => {
//   const id = Number(req.body.id),
//         eventId = req.body.eventId,
//         lat = req.body.lat,
//         long = req.body.long,
//         name = req.body.name;
//   db.one(
//     'UPDATE bars SET eventId = $1, lat = $2, long = $3, name = $4 WHERE id = $5 returning id',
//     [eventId, lat, long, name, id]
//   ).then(data => {
//     res.locals.editedData = data;
//     next();
//   })
// }

// Bars.destroy = (req, res, next) => {
//     const id = Number(req.params.id);
//     db.none(
//         'DELETE FROM bars WHERE id = $1', [id]
//     ).then(() => {
//         next();
//     });
// };

// export the model
module.exports = Bars;
