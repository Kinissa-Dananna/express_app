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

Events.findUsersForEvent = (req, res, next) => {
  const eventId = req.params.id
  db.many(`SELECT * FROM users
    JOIN events_users
    ON events_users.userId = users.id
    JOIN events
    ON events.id = events_users.eventId
    WHERE events.id = $1`. [eventId])
    .then((users) => {
      res.locals.users = users;
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
  const { name, description, time } = req.body;
  db.one(`INSERT INTO events (name, description, time)
  VALUES ($1, $2, $3) RETURNING id`,
  [name, description, time])
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
    const { name, description, time } = req.body;

    db.one(`UPDATE events
      SET name = $1, description = $2, time = $3 WHERE id = $4
      RETURNING id`,
      [name, description, time])
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
