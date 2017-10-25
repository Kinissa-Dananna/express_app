const router = require('express').Router();
const Events = require('../models/Events');
const Auth = require('../services/auth');

// get all Eventss
router.get('/', Events.findAll, (req, res) => {
  const events = res.locals.events;

  res.json(events);
});

// get one Event by id
router.get('/:id', Events.findById, Events.findUsersForEvent, (req, res) => {
  const event = res.locals.event;
  const event.users = res.locals.users;

  res.json(event);
});

// add a new Event
router.post('/', Events.create, (req, res) => {
  const events = res.locals.events;

  res.json(events);
});

// edit an existing Events
router.put('/:id', Events.update, (req, res) => {
  const event = res.locals.event;

  res.json(event);
});

// delete an Event
router.delete('/:id', Events.delete, (req, res) => {
  const event = res.locals.event;

  res.json({message: 'Event successfully deleted!'});
});

module.exports = router;
