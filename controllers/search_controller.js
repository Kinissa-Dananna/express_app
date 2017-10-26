const express = require('express');
const router = express.Router();

const Search = require('../models/search');
const Bars = require('../models/bars');

// user chose a location from the autocomplete options
router.get('/autocomplete/:placeId',
  Search.getLatLong,
  Bars.searchNearbyBars,
  (req, res) => {
    res.json({
      searchLocation: res.locals.latLong,
      results: res.locals.fiveResults
    });
});

// user hit enter instead of choosing an autocompleted option, and entered a search term
router.get('/:placeId/:barQuery',
  Search.getFirstResult,
  Search.getLatLongForInput,
  Bars.searchBars,
	(req, res) => {
		res.json({
      searchLocation: res.locals.latLong,
			results: res.locals.fiveResults
		});
	});

// user hit enter instead of choosing an autocompleted option, but has not entered a search term
  router.get('/nearby/:query',
    Search.getFirstResult,
    Search.getLatLongForInput,
    Bars.searchNearbyBars,
  	(req, res) => {
  		res.json({
        searchLocation: res.locals.latLong,
  			results: res.locals.fiveResults
  		});
  	});

// populate autocomplete location results
router.get('/:query',
  Search.populateResults,
	(req, res) => {
		res.json({
			results: res.locals.results
		});
	});

// user chooses a bar result from their search, and adds it to the event
router.post('/add/:eventId',
  Bars.create,
  (req, res) => {
		res.json(
			res.locals.arrayResults
		);
	});

module.exports = router;
