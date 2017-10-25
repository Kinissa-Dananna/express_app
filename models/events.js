const db = require('../db/config');
const Events = {};

// get all events
Events.findAllForOwner = (req, res, next) => {
  const userId = req.params.ownerId
  db.many('SELECT * FROM events WHERE ownerId = $1'. [ownerId])
    .then((events) => {
      res.locals.events = events;
      next();
    })
    .catch(err => {
      console.log('Error getting data from database');
    });
};

Events.findAllForUser = (req, res, next) => {
  const userId = req.user.id
  db.many(`SELECT * FROM events
    JOIN events_users
    ON events_users.eventId = events.id
    JOIN users
    ON users.id = events_users.userId
    WHERE users.id = $1`. [userId])
    .then((events) => {
      res.locals.events = events;
      next();
    })
    .catch(err => {
      console.log('Error getting data from database');
    });
};

// get one event
Events.findById = (req, res, next) => {
  const myId = req.params.id;
  db.one('SELECT * FROM events WHERE id = $1', [myId])
    .then((event) => {
      res.locals.event = event;
      next();
    })
    .catch(err => {
      console.log('Error getting data from database');
    });
};

// make a new event
Events.create = (req, res, next) => {
  const { name, year, grapes, country, region, description, picture, price } = req.body;
  db.one(`INSERT INTO events (name, year, grapes, country, region, description, picture, price)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
  [name, year, grapes, country, region, description, picture, price])
    .then((event) => {
      res.locals.event = event;
      next();
    })
    .catch(err => {
      console.log('Error fetching data from database');
      res.status(500).json({
        message: 'could not create event'
      });
    });
  };

  // update a event's info
  Events.update = (req, res, next) => {
    const { id } = req.params;
    const { name, year, grapes, country, region, description, picture, price } = req.body;

    db.one(`UPDATE events
      SET name = $1, year = $2, grapes = $3, country = $4, region = $5, description = $6, picture = $7, price = $8 WHERE id = $9
      RETURNING id`,
      [name, year, grapes, country, region, description, picture, price, id])
      .then((event) => {
        res.locals.event = event;
        next();
      })
      .catch(err => {
        console.log('Error fetching data from database');
        res.status(500).json({
          message: 'could not update event'
        });
      });
  };

  // delete a event
  Events.delete = (req, res, next) => {
    const { id } = req.params;

    db.many('DELETE FROM events WHERE id = $1 RETURNING *', [id])
      .then((events) => {
        res.locals.events = events;
        next();
      })
      .catch(err => {
        console.log('Error getting data from database');
      });
  };

module.exports = event;
