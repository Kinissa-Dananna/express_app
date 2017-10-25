// add all required files
const axios = require('axios');
const db = require('../db');

// create the model object
const Bars = {}



Bars.findAllByEventId = (req, res, next) => {
    const eventId = req.params.id;
    db.one(
        'SELECT * FROM bars WHERE eventId=$1', [id] // use the id here
    ).then(data => {
        res.locals.data = data;
        next();
    });
};

//--------------------------------------------------------------
//--------------------------- API ROUTES ---------------------
//--------------------------------------------------------------

Bars.create = (req, res, next) => {
  const eventId = req.body.eventId,
        lat = req.body.lat,
        long = req.body.long,
        name = req.body.name;
  db.one(
    'INSERT INTO bars (eventId, lat, long, name) VALUES ($1, $2, $3, $4) returning id',
    [eventId, lat, long, name]
  ).then(data => {
    console.log('Data: ' + data);
    res.locals.newData = data;
    next();
  });
}

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

Bars.destroy = (req, res, next) => {
    const id = Number(req.params.id);
    db.none(
        'DELETE FROM bars WHERE id = $1', [id]
    ).then(() => {
        next();
    });
};

// export the model
module.exports = Bars;
