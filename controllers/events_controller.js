const router = require('express').Router();
const Events = require('../models/events');
const Auth = require('../services/auth');

// get all Events for a user
router.get('/',
  Auth.restrict,
  Events.findAllForUser, (req, res) => {
    const events = res.locals.events;

    res.json(events);
  });

// get all events a user owns
router.get('/owned',
  Auth.restrict,
  Events.findAllForOwner,
  Events.findOwnersForEventBatch,
  Events.findUsersForEventBatch,
  Events.findBarsForEventBatch,
  (req, res) => {
    const events = res.locals.events;
    events.map((event, i) => {
      event.owner = res.locals.owners[i][0];
      event.attendees = res.locals.users[i];
      event.bars = res.locals.bars[i];
    })
    res.json(events);
  });

// add a user to an event
router.post('/:id/newuser', Auth.restrict, Events.addUserToEvent, (req, res) => {
  const pair = res.locals.pair;

  res.json(pair);
});

// get one Event and its users by event id
router.get('/:id',
  Auth.restrict,
  Events.findById,
  Events.findUsersForEvent,
  Events.findOwnerForEvent,
  Events.findBarsForEvent,
  (req, res) => {
    const event = res.locals.event;
    event.owner = res.locals.owner[0];
    event.attendees = res.locals.users;
    event.bars = res.locals.bars;
    res.json(event);
  });

// add a new Event
router.post('/',
  Auth.restrict,
  Events.create,
  (req, res) => {
    const event = res.locals.event;

    res.json(event);
  });

// edit an existing Event
router.put('/:id',
  Auth.restrict,
  Events.update, (req, res) => {
    const event = res.locals.event;

    res.json(event);
  });
// remove yourself from event
router.delete('/:eventId/self',
  Auth.restrict,
  Events.removeSelf,
  (req, res) => {
    console.log('deleting user');
    const event = res.locals.event;

    res.json({ message: "successfully removed self from event" });
  });
// remove a user from an event
router.delete('/:eventId/user/:userId',
  Auth.restrict,
  Events.removeUser,
  (req, res) => {
    console.log('deleting user');
    const event = res.locals.event;

    res.json({ message: "successfully removed user from event" });
  });

// delete an Event
router.delete('/:id',
  Auth.restrict,
  Events.delete,
  (req, res) => {
    res.json({ message: 'Event successfully deleted!' });
  });

module.exports = router;
