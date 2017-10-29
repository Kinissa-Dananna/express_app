const db = require('../db/config');
const Events = {};

// get all events owned by this user
Events.findAllForOwner = (req, res, next) => {
  const ownerId = req.user.id;
  console.log(ownerId);
  db.manyOrNone('SELECT * FROM events WHERE ownerId = $1', [ownerId]).then((events) => {
    res.locals.events = events;
    next();
  }).catch(err => {
    console.log('Error getting data from database');
  });
};

// find an event's owner
Events.findOwnerForEvent = (req, res, next) => {
  const ownerId = res.locals.event.ownerId;
  db.manyOrNone('SELECT name, email FROM users WHERE id = $1', [ownerId]).then((owner) => {
    res.locals.owner = owner;
    next();
  }).catch(err => {
    console.log('Error getting data from database');
  });
};

// find all users linked to an event by the join table
Events.findUsersForEvent = (req, res, next) => {
  const eventId = req.params.id
  db.manyOrNone(`SELECT users.id, users.name, users.image, users.email FROM users
    JOIN events_users
    ON events_users.userId = users.id
    JOIN events
    ON events.id = events_users.eventId
    WHERE events.id = $1`, [eventId]).then((users) => {
      res.locals.users = users;
      next();
    }).catch(err => {
      console.log('Error getting data from database');
    });
};

// find all bars for a single event
Events.findBarsForEvent = (req, res, next) => {
  const eventId = res.locals.event.id;
  db.manyOrNone('SELECT * FROM bars WHERE eventId = $1', [eventId]).then((bars) => {
    res.locals.bars = bars;
    next();
  }).catch(err => {
    console.log('Error getting data from database');
  });
};

// get all events linked to this user by the join table
Events.findAllForUser = (req, res, next) => {
  const userId = req.user.id;
  db.manyOrNone(`SELECT events.* FROM events
    JOIN events_users
    ON events_users.eventId = events.id
    JOIN users
    ON users.id = events_users.userId
    WHERE users.id = $1`, [userId]).then((events) => {
      res.locals.events = events;
      next();
    }).catch(err => {
      console.log('Error getting data from database');
    });
};

// get all users for a batch of events
Events.findUsersForEventBatch = (req, res, next) => {
  const { events } = res.locals;
  db.task(t => {
    return t.batch(events.map(event => {
      return t.manyOrNone(`SELECT users.id, users.name, users.email FROM users
        JOIN events_users
        ON events_users.userId = users.id
        JOIN events
        ON events.id = events_users.eventId
        WHERE events.id = $1`, [event.id])
    }))
  }).then(users => {
    res.locals.users = users;
    next();
  })
}

// get all bars for a batch of events
Events.findBarsForEventBatch = (req, res, next) => {
  const { events } = res.locals;
  db.task(t => {
    return t.batch(events.map(event => {
      return t.manyOrNone(`SELECT * FROM bars WHERE eventId = $1`, [event.id])
    }))
  }).then(bars => {
    res.locals.bars = bars;
    next();
  })
}

// get all owners for a batch of events
Events.findOwnersForEventBatch = (req, res, next) => {
  const { events } = res.locals;
  db.task(t => {
    return t.batch(events.map(event => {
      return t.manyOrNone(`SELECT id, name, email FROM users WHERE id = $1`, [event.ownerid])
    }))
  }).then(owners => {
    res.locals.owners = owners;
    next();
  })
}

// get one event by id
Events.findById = (req, res, next) => {
  const myId = req.params.id;
  db.one('SELECT * FROM events WHERE id = $1', [myId]).then((event) => {
    res.locals.event = event;
    next();
  }).catch(err => {
    console.log('Error getting data from database');
  });
};

// make a new event
Events.create = (req, res, next) => {
  const ownerId = req.user.id;
  console.log(ownerId);
  const { name, description, time } = req.body;
  db.one(`INSERT INTO events (name, description, time, ownerId)
  VALUES ($1, $2, $3, $4) RETURNING id`, [name, description, time, ownerId]).then((event) => {
      console.log(event);
      res.locals.event = event;
      next();
    }).catch(err => {
      console.log('Error fetching data from database from Create Event');
      res.status(500).json({ message: 'could not create event' });
    });
};

// update a event's info
Events.update = (req, res, next) => {
  const id = req.params.id;
  const { name, description, time } = req.body;
  db.one('SELECT * FROM events WHERE id = $1', [eventId]).then((event) => {
    if (event.ownerid === Number(userId)) {
      db.one(`UPDATE events
      SET name = $1, description = $2, time = $3 WHERE id = $4
      RETURNING id`, [name, description, time, id]).then((event) => {
          res.locals.event = event;
          next();
        }).catch(err => {
          console.log('Error fetching data from database');
          res.status(500).json({ message: 'could not update event' });
        });
    } else {
      res.status(500).json({ message: "you don't own this event!" });
      next();
    }
  });
};

// delete a event
Events.delete = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  db.one('SELECT * FROM events WHERE id = $1', [id]).then((event) => {
    if (event.ownerid === Number(userId)) {
      db.none('DELETE FROM events WHERE id = $1', [id]).then(res => {
        next();
      }).catch(err => {
        console.log('Error deleting data from database');
      });
    } else {
      console.log('nope!');
      res.status(500).json({ error: "you don't own this event!" });
      next();
    }
  });
};

// add a row in the join table connecting a user to an event
Events.addUserToEvent = (req, res, next) => {
  const eventId = req.params.id
  const userId = req.user.id
  const newUserId = req.body.userId;
  db.one('SELECT * FROM events WHERE id = $1', [eventId]).then((event) => {
    if (event.ownerid === Number(userId)) {
      db.one(`INSERT INTO events_users (eventId, userId)
  VALUES ($1, $2) RETURNING *`, [eventId, newUserId]).then((pair) => {
        res.locals.pair = pair;
        next();
      }).catch(err => {
        console.log('Error posting data to database');
        res.status(500).json({message: 'could not add user to event'});
      })
    } else {
      res.status(500).json({ message: "you don't own this event!" });
      next();
    }
  });
}

Events.removeSelf = (req, res, next) => {
  const eventId = req.params.eventId
  const userId = req.user.id;
  db.none(`DELETE FROM events_users
  WHERE eventId = $1 AND userId = $2`, [eventId, userId]).then(() => {
      next();
    }).catch(err => {
      console.log('Error posting data to database');
      res.status(500).json({ message: 'could not add user to event' });
    });
};

Events.removeUser = (req, res, next) => {
  const eventId = req.params.eventId
  const userId = req.params.userId;
  db.one('SELECT * FROM events WHERE id = $1', [eventId]).then((event) => {
    if (event.ownerid === Number(userId)) {
      db.none(`DELETE FROM events_users
    WHERE eventId = $1 AND userId = $2`, [eventId, userId]).then(() => {
          next();
        }).catch(err => {
          console.log('Error posting data to database');
          res.status(500).json({ message: 'could not add user to event' });
        });
    } else {
      res.status(500).json({ message: "you don't own this event!" });
      next();
    }
  });
};

module.exports = Events;
