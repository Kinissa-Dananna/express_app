const router = require('express').Router();
const User = require('../models/user-search');
const Auth = require('../services/auth');


router.get('/:userSearch',
  Auth.restrict,
  User.findByName,
  (req, res) => {
	   const { userName } = res.locals.userName;
	    res.json(userName);
  });


module.exports = router;
